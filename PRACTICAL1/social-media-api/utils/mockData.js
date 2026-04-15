// Mock users data
const users = [
  {
    id: "1",
    username: "traveler",
    email: "traveler@example.com",
    full_name: "Karma",
    profile_picture: "https://example.com/profiles/traveler.jpg",
    bio: "Travel photographer",
    created_at: "2023-01-15"
  },
  {
    id: "2",
    username: "foodie",
    email: "foodie@example.com",
    full_name: "Tashi",
    profile_picture: "https://example.com/profiles/foodie.jpg",
    bio: "Food lover and recipe creator",
    created_at: "2023-01-20"
  },
  {
    id: "3",
    username: "adventurer",
    email: "adventurer@example.com",
    full_name: "Sonam",
    profile_picture: "https://example.com/profiles/adventurer.jpg",
    bio: "Outdoor adventures and hiking",
    created_at: "2023-02-10"
  }
];

// Mock posts data
const posts = [
  {
    id: "1",
    caption: "Beautiful sunset at the beach! 🌅",
    image: "https://example.com/images/sunset.jpg",
    user_id: "1",
    created_at: "2023-03-01"
  },
  {
    id: "2",
    caption: "Delicious homemade pasta 🍝",
    image: "https://example.com/images/pasta.jpg",
    user_id: "2",
    created_at: "2023-03-02"
  },
  {
    id: "3",
    caption: "Mountain hiking adventure ⛰️",
    image: "https://example.com/images/mountain.jpg",
    user_id: "3",
    created_at: "2023-03-03"
  }
];

// Mock comments data
const comments = [
  {
    id: "1",
    content: "Amazing photo! 😍",
    post_id: "1",
    user_id: "2",
    created_at: "2023-03-01T10:30:00Z"
  },
  {
    id: "2",
    content: "Where is this place?",
    post_id: "1",
    user_id: "3",
    created_at: "2023-03-01T11:15:00Z"
  },
  {
    id: "3",
    content: "Looks delicious! 🍝",
    post_id: "2",
    user_id: "1",
    created_at: "2023-03-02T14:20:00Z"
  }
];

// Mock likes data
const likes = [
  {
    id: "1",
    post_id: "1",
    user_id: "2",
    created_at: "2023-03-01T10:25:00Z"
  },
  {
    id: "2",
    post_id: "1",
    user_id: "3",
    created_at: "2023-03-01T10:28:00Z"
  },
  {
    id: "3",
    post_id: "2",
    user_id: "1",
    created_at: "2023-03-02T13:15:00Z"
  },
  {
    id: "4",
    post_id: "3",
    user_id: "2",
    created_at: "2023-03-03T09:45:00Z"
  }
];

// Mock followers data
const followers = [
  {
    id: "1",
    follower_id: "2",
    following_id: "1",
    created_at: "2023-01-20T08:00:00Z"
  },
  {
    id: "2",
    follower_id: "3",
    following_id: "1",
    created_at: "2023-01-21T09:30:00Z"
  },
  {
    id: "3",
    follower_id: "1",
    following_id: "2",
    created_at: "2023-01-22T10:15:00Z"
  }
];

module.exports = { users, posts, comments, likes, followers };