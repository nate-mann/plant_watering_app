const STARTUP = {
  name: "Sprout",
  tagline: "A calmer way to care for your plants.",
  pitch: "Keep track of watering, see what needs attention first, and find a plant sitter when life takes you away."
};

const STARTER_PLANTS = [
  { id: "monstera", name: "Monstera", species: "Monstera deliciosa", location: "Living room", interval: 7, daysSinceWatered: 9, image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=720&q=80" },
  { id: "peace-lily", name: "Peace lily", species: "Spathiphyllum", location: "Bedroom", interval: 5, daysSinceWatered: 6, image: "https://images.unsplash.com/photo-1508020963102-c6c723be5764?auto=format&fit=crop&w=720&q=80" },
  { id: "pothos", name: "Golden pothos", species: "Epipremnum aureum", location: "Kitchen shelf", interval: 8, daysSinceWatered: 7, image: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=720&q=80" },
  { id: "snake-plant", name: "Snake plant", species: "Dracaena trifasciata", location: "Hallway", interval: 21, daysSinceWatered: 12, image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=720&q=80" }
];

const SITTERS = [
  { id: "maya", name: "Maya", initials: "M", neighborhood: "Downtown", rate: 18, rating: "4.9", visits: 32, bio: "Happy to give your indoor jungle a little care while you're away.", specialties: "Succulents · Tropical plants", color: "sage" },
  { id: "eli", name: "Eli", initials: "E", neighborhood: "North End", rate: 15, rating: "5.0", visits: 24, bio: "Patient plant person with a soft spot for leafy rescues.", specialties: "Ferns · Houseplants", color: "coral" },
  { id: "nina", name: "Nina", initials: "N", neighborhood: "West Side", rate: 20, rating: "4.8", visits: 41, bio: "Careful check-ins and photo updates for your plants.", specialties: "Orchids · Rare plants", color: "blue" }
];
