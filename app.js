(function () {
  "use strict";

  const storage = {
    get: function (key, fallback) {
      try {
        const saved = localStorage.getItem(key);
        return saved === null ? fallback : JSON.parse(saved);
      } catch (error) {
        return fallback; // storage blocked or broken: just carry on
      }
    },
    set: function (key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        // storage blocked (e.g. private window): ignore
      }
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  function dateOffset(days) {
    const date = new Date(today);
    date.setDate(date.getDate() - days);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  const initialPlants = STARTER_PLANTS.map(function (plant) {
    const wateredOn = dateOffset(plant.daysSinceWatered);
    return {
      id: plant.id,
      name: plant.name,
      species: plant.species,
      location: plant.location,
      interval: plant.interval,
      lastWatered: wateredOn,
      history: [wateredOn],
      notes: "",
      image: plant.image
    };
  });
  let plants = storage.get("sproutPlants", null);
  if (!Array.isArray(plants)) {
    plants = initialPlants;
    storage.set("sproutPlants", plants);
  } else {
    plants.forEach(function (plant) {
      if (!Array.isArray(plant.history)) plant.history = [plant.lastWatered];
      if (typeof plant.notes !== "string") plant.notes = "";
    });
  }

  document.title = STARTUP.name;
  document.getElementById("brand-name").textContent = STARTUP.name;

  function showView() {
    const requested = (window.location.hash || "#dashboard").slice(1);
    const views = document.querySelectorAll("[data-view]");
    const exists = Array.prototype.some.call(views, function (view) {
      return view.id === requested;
    });
    const current = exists ? requested : "dashboard";

    views.forEach(function (view) {
      view.hidden = view.id !== current;
    });

    document.querySelectorAll("nav a").forEach(function (link) {
      if (link.getAttribute("href") === "#" + current) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", showView);

  const plantGrid = document.getElementById("plant-grid");
  const emptyMessage = document.getElementById("empty-message");
  const noResultsMessage = document.getElementById("no-results-message");
  const collectionTools = document.getElementById("collection-tools");
  const searchInput = document.getElementById("plant-search");
  const plantDialog = document.getElementById("plant-dialog");
  const plantForm = document.getElementById("plant-form");
  const bookingDialog = document.getElementById("booking-dialog");
  const bookingForm = document.getElementById("booking-form");
  let activeFilter = "all";
  let editingPlantId = null;
  let selectedSitter = null;

  function daysUntilWater(plant) {
    const lastWatered = new Date(plant.lastWatered + "T00:00:00");
    return plant.interval - Math.floor((today - lastWatered) / 86400000);
  }

  function urgencyText(days) {
    if (days < 0) return Math.abs(days) + " day" + (days === -1 ? "" : "s") + " overdue";
    if (days === 0) return "Water today";
    if (days === 1) return "Water tomorrow";
    return "In " + days + " days";
  }

  function formatDate(dateString) {
    const date = new Date(dateString + "T00:00:00");
    return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(date);
  }

  function daysSinceWatered(plant) {
    const lastWatered = new Date(plant.lastWatered + "T00:00:00");
    return Math.max(0, Math.floor((today - lastWatered) / 86400000));
  }

  function makePlantCard(plant) {
    const card = document.createElement("article");
    card.className = "plant-card";
    const daysLeft = daysUntilWater(plant);
    const image = document.createElement("img");
    image.className = "plant-photo";
    image.src = plant.image || "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=720&q=80";
    image.alt = plant.species ? plant.species + " plant" : plant.name;
    image.loading = "lazy";

    const content = document.createElement("div");
    content.className = "plant-content";
    const status = document.createElement("span");
    status.className = "status " + (daysLeft <= 0 ? "status-due" : "status-later");
    status.textContent = urgencyText(daysLeft);

    const title = document.createElement("h2");
    title.textContent = plant.name;

    const detail = document.createElement("p");
    detail.className = "plant-detail";
    detail.textContent = [plant.species, plant.location].filter(Boolean).join(" · ");

    const care = document.createElement("p");
    care.className = "care-note";
    care.textContent = "Every " + plant.interval + " days · Last watered " + daysSinceWatered(plant) + " day" + (daysSinceWatered(plant) === 1 ? "" : "s") + " ago";

    const journal = document.createElement("details");
    journal.className = "plant-journal";
    const journalSummary = document.createElement("summary");
    const history = (plant.history || [plant.lastWatered]).slice().sort().reverse().slice(0, 5);
    journalSummary.textContent = "Care journal · " + history.length + " entr" + (history.length === 1 ? "y" : "ies");
    journal.append(journalSummary);
    if (plant.notes) {
      const notes = document.createElement("p");
      notes.className = "journal-notes";
      notes.textContent = plant.notes;
      journal.append(notes);
    }
    const historyList = document.createElement("ul");
    history.forEach(function (date) {
      const entry = document.createElement("li");
      entry.textContent = "Watered " + formatDate(date);
      historyList.append(entry);
    });
    journal.append(historyList);

    const actions = document.createElement("div");
    actions.className = "plant-actions";
    const actionGroup = document.createElement("div");
    actionGroup.className = "plant-action-group";
    const wateredButton = document.createElement("button");
    wateredButton.type = "button";
    wateredButton.className = "button water-button";
    wateredButton.textContent = "Watered";
    wateredButton.setAttribute("aria-label", "Mark " + plant.name + " as watered today");
    wateredButton.addEventListener("click", function () {
      plant.lastWatered = dateOffset(0);
      if (!Array.isArray(plant.history)) plant.history = [];
      if (plant.history[0] !== plant.lastWatered) plant.history.unshift(plant.lastWatered);
      plant.history = plant.history.slice(0, 20);
      savePlants();
    });

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "edit-button";
    editButton.textContent = "Edit care";
    editButton.addEventListener("click", function () { openPlantEditor(plant); });

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "icon-button remove-button";
    removeButton.textContent = "×";
    removeButton.title = "Remove " + plant.name;
    removeButton.setAttribute("aria-label", "Remove " + plant.name);
    removeButton.addEventListener("click", function () {
      if (window.confirm("Remove " + plant.name + " from your plants?")) {
        plants = plants.filter(function (item) { return item.id !== plant.id; });
        savePlants();
      }
    });

    actionGroup.append(wateredButton, editButton);
    actions.append(actionGroup, removeButton);
    content.append(status, title, detail, care, journal, actions);
    card.append(image, content);
    return card;
  }

  function savePlants() {
    storage.set("sproutPlants", plants);
    renderPlants();
  }

  function renderPlants() {
    const prioritized = plants.slice().sort(function (first, second) {
      return daysUntilWater(first) - daysUntilWater(second);
    });
    const dueCount = prioritized.filter(function (plant) { return daysUntilWater(plant) <= 0; }).length;
    const upcomingCount = plants.length - dueCount;
    const query = searchInput.value.trim().toLowerCase();
    const matchingPlants = prioritized.filter(function (plant) {
      const matchesFilter = activeFilter === "all" ||
        (activeFilter === "due" && daysUntilWater(plant) <= 0) ||
        (activeFilter === "upcoming" && daysUntilWater(plant) > 0);
      const searchableText = [plant.name, plant.species, plant.location].join(" ").toLowerCase();
      return matchesFilter && searchableText.indexOf(query) !== -1;
    });
    plantGrid.replaceChildren.apply(plantGrid, matchingPlants.map(makePlantCard));
    emptyMessage.hidden = plants.length > 0;
    collectionTools.hidden = plants.length === 0;
    plantGrid.hidden = matchingPlants.length === 0;
    noResultsMessage.hidden = plants.length === 0 || matchingPlants.length > 0;
    document.getElementById("results-count").textContent = "Showing " + matchingPlants.length + " of " + plants.length + " plants";
    document.getElementById("plant-count").textContent = plants.length;
    document.getElementById("due-count").textContent = dueCount;
    document.getElementById("all-filter-count").textContent = plants.length;
    document.getElementById("due-filter-count").textContent = dueCount;
    document.getElementById("upcoming-filter-count").textContent = upcomingCount;
    document.querySelectorAll(".filter-button").forEach(function (button) {
      button.setAttribute("aria-pressed", button.dataset.filter === activeFilter ? "true" : "false");
    });
    const duePlants = prioritized.filter(function (plant) { return daysUntilWater(plant) <= 0; });
    const priorityTitle = document.getElementById("priority-title");
    const priorityDetail = document.getElementById("priority-detail");
    if (duePlants.length) {
      priorityTitle.textContent = duePlants.length + " plant" + (duePlants.length === 1 ? "" : "s") + " need water";
      priorityDetail.textContent = duePlants[0].name + " is your top priority. Water the most overdue plants first.";
    } else if (prioritized.length) {
      priorityTitle.textContent = "You're all caught up";
      priorityDetail.textContent = prioritized[0].name + " is next, " + urgencyText(daysUntilWater(prioritized[0])).toLowerCase() + ".";
    } else {
      priorityTitle.textContent = "Your plants will show up here";
      priorityDetail.textContent = "Add a plant to get your first watering reminder.";
    }
  }

  function openPlantForm() {
    plantForm.reset();
    editingPlantId = null;
    document.getElementById("plant-dialog-kicker").textContent = "NEW LEAF";
    document.getElementById("plant-dialog-title").textContent = "Add a plant";
    document.getElementById("save-plant-button").textContent = "Add plant";
    plantForm.elements.lastWatered.value = dateOffset(0);
    plantDialog.showModal();
    plantForm.elements.name.focus();
  }

  function openPlantEditor(plant) {
    plantForm.reset();
    editingPlantId = plant.id;
    document.getElementById("plant-dialog-kicker").textContent = "PLANT DETAILS";
    document.getElementById("plant-dialog-title").textContent = "Edit " + plant.name;
    document.getElementById("save-plant-button").textContent = "Save changes";
    plantForm.elements.name.value = plant.name;
    plantForm.elements.species.value = plant.species || "";
    plantForm.elements.interval.value = plant.interval;
    plantForm.elements.lastWatered.value = plant.lastWatered;
    plantForm.elements.location.value = plant.location || "";
    plantForm.elements.notes.value = plant.notes || "";
    plantDialog.showModal();
    plantForm.elements.name.focus();
  }

  document.getElementById("open-plant-form").addEventListener("click", openPlantForm);
  document.getElementById("empty-add-button").addEventListener("click", openPlantForm);
  document.getElementById("close-plant-form").addEventListener("click", function () { plantDialog.close(); });
  document.getElementById("cancel-plant-form").addEventListener("click", function () { plantDialog.close(); });
  plantForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(plantForm);
    const updatedValues = {
      name: formData.get("name").trim(),
      species: formData.get("species").trim(),
      location: formData.get("location").trim(),
      interval: Number(formData.get("interval")),
      lastWatered: formData.get("lastWatered"),
      notes: formData.get("notes").trim()
    };
    if (editingPlantId !== null) {
      const plant = plants.find(function (item) { return item.id === editingPlantId; });
      if (plant) {
        const dateChanged = plant.lastWatered !== updatedValues.lastWatered;
        Object.assign(plant, updatedValues);
        if (!Array.isArray(plant.history)) plant.history = [];
        if (dateChanged && plant.history[0] !== plant.lastWatered) plant.history.unshift(plant.lastWatered);
      }
    } else {
      activeFilter = "all";
      searchInput.value = "";
      const wateredOn = updatedValues.lastWatered;
      plants.push(Object.assign({
        id: window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : String(Date.now()),
        image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=720&q=80",
        history: [wateredOn]
      }, updatedValues));
    }
    savePlants();
    plantDialog.close();
  });

  searchInput.addEventListener("input", renderPlants);
  document.querySelectorAll(".filter-button").forEach(function (button) {
    button.addEventListener("click", function () {
      activeFilter = button.dataset.filter;
      renderPlants();
    });
  });
  document.getElementById("clear-filters").addEventListener("click", function () {
    activeFilter = "all";
    searchInput.value = "";
    renderPlants();
    searchInput.focus();
  });

  function makeSitterCard(sitter) {
    const card = document.createElement("article");
    card.className = "sitter-card";
    const avatar = document.createElement("div");
    avatar.className = "sitter-avatar " + sitter.color;
    avatar.textContent = sitter.initials;
    const top = document.createElement("div");
    top.className = "sitter-top";
    const identity = document.createElement("div");
    const name = document.createElement("h2");
    name.textContent = sitter.name;
    const area = document.createElement("p");
    area.className = "sitter-area";
    area.textContent = sitter.neighborhood + " · " + sitter.visits + " visits";
    identity.append(name, area);
    top.append(avatar, identity);
    const rating = document.createElement("p");
    rating.className = "sitter-rating";
    rating.textContent = "★ " + sitter.rating + "  ·  " + sitter.specialties;
    const bio = document.createElement("p");
    bio.className = "sitter-bio";
    bio.textContent = sitter.bio;
    const footer = document.createElement("div");
    footer.className = "sitter-footer";
    const rate = document.createElement("strong");
    rate.textContent = "$" + sitter.rate + "<small> / visit</small>";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "button secondary";
    button.textContent = "Request";
    button.addEventListener("click", function () {
      selectedSitter = sitter;
      document.getElementById("booking-sitter-name").textContent = "A demo request for " + sitter.name + " in " + sitter.neighborhood + ".";
      bookingForm.reset();
      bookingDialog.showModal();
      bookingForm.elements.ownerName.focus();
    });
    footer.append(rate, button);
    card.append(top, rating, bio, footer);
    return card;
  }

  document.getElementById("sitter-grid").replaceChildren.apply(
    document.getElementById("sitter-grid"), SITTERS.map(makeSitterCard)
  );
  document.getElementById("close-booking-form").addEventListener("click", function () { bookingDialog.close(); });
  document.getElementById("cancel-booking-form").addEventListener("click", function () { bookingDialog.close(); });
  bookingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = selectedSitter ? selectedSitter.name : "your sitter";
    bookingDialog.close();
    window.alert("Demo only: your request preview for " + name + " is ready. No booking was sent.");
  });

  renderPlants();
  showView();
})();
