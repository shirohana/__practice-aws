class User {
  constructor (item) {
    this.username = item.username.S
    this.name = item.name.S
    this.email = item.email.S
    this.birthdate = item.birthdate.S
    this.address = item.address.S
    this.status = item.status.S
    this.interests = item.interests.S
    this.pinned_image = (item.pinnedImage || {}).S
    this.recommended_friends = (item.recommendedFriends || {}).L
  }
}

class Photo {
  constructor (item) {
    this.username = item.username.S
    this.timestamp = item.timestamp.S
    this.location = item.location.S
  }
}

class Reaction {
  constructor (item) {
    this.reacting_user = item.reactingUser.S
    this.photo = item.photo.S
    this.reaction_type = item.reactionType.S
    this.timestamp = item.timestamp.S
  }
}

class Friendship {
  constructor (item) {
    this.followed_user = item.followedUser.S
    this.following_user = item.followingUser.S
    this.timestamp = item.timestamp.S
  }
}

module.exports = {
  User,
  Photo,
  Reaction,
  Friendship
}
