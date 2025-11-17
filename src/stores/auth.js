import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: null,
    users: [],
  }),

  persist: {
    key: 'auth-store',
    storage: localStorage,
  },

  getters: {
    isAuthenticated: state => !!state.currentUser,
    fullName: state => {
      if (!state.currentUser) return 'User'
      const { firstName, lastName } = state.currentUser
      if (firstName && lastName) return `${firstName} ${lastName}`
      if (firstName) return firstName
      return state.currentUser?.email || 'User'
    },
  },

  actions: {
    register({ firstName, lastName, email, password }) {
      const emailLower = String(email || '')
        .trim()
        .toLowerCase()

      if (!emailLower || !password) throw new Error('Email and password are required')
      if (!firstName) throw new Error('First name is required')
      if (!lastName) throw new Error('Last name is required')

      const existing = this.users.find(u => u.email === emailLower)

      if (existing) throw new Error('Email already registered')

      const newUser = {
        id: crypto && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        firstName: String(firstName).trim(),
        lastName: String(lastName).trim(),
        email: emailLower,
        password: String(password),
        createdAt: new Date().toISOString(),
      }

      this.users = [...this.users, newUser]

      // Auto-login
      this.currentUser = {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      }

      return this.currentUser
    },

    login({ email, password }) {
      const emailLower = String(email || '')
        .trim()
        .toLowerCase()
      const user = this.users.find(u => u.email === emailLower && u.password === String(password))

      if (!user) throw new Error('Invalid email or password')

      this.currentUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      }

      return this.currentUser
    },

    logout() {
      this.currentUser = null
    },

    updateProfile({ firstName, lastName, email }) {
      if (!this.currentUser) throw new Error('Not authenticated')

      const emailLower = String(email || '')
        .trim()
        .toLowerCase()

      if (!emailLower) throw new Error('Email is required')
      if (!firstName) throw new Error('First name is required')
      if (!lastName) throw new Error('Last name is required')

      // Check if email is already taken by another user
      const existing = this.users.find(u => u.email === emailLower && u.id !== this.currentUser.id)
      if (existing) throw new Error('Email already taken by another user')

      // Find and update user
      const userIndex = this.users.findIndex(u => u.id === this.currentUser.id)
      if (userIndex === -1) throw new Error('User not found')

      this.users[userIndex] = {
        ...this.users[userIndex],
        firstName: String(firstName).trim(),
        lastName: String(lastName).trim(),
        email: emailLower,
      }

      // Update current session
      this.currentUser = {
        ...this.currentUser,
        firstName: this.users[userIndex].firstName,
        lastName: this.users[userIndex].lastName,
        email: this.users[userIndex].email,
      }

      return this.currentUser
    },

    changePassword({ currentPassword, newPassword }) {
      if (!this.currentUser) throw new Error('Not authenticated')

      const userIndex = this.users.findIndex(u => u.id === this.currentUser.id)
      if (userIndex === -1) throw new Error('User not found')

      // Verify current password
      if (this.users[userIndex].password !== String(currentPassword)) {
        throw new Error('Current password is incorrect')
      }

      // Validate password requirements
      if (!newPassword || newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long')
      }

      if (/\s/.test(newPassword)) {
        throw new Error('Password cannot contain whitespace characters')
      }

      if (!/[a-z]/.test(newPassword)) {
        throw new Error('Password must contain at least one lowercase character')
      }

      if (!/[\d\W]/.test(newPassword)) {
        throw new Error('Password must contain at least one number or symbol')
      }

      // Update password
      this.users[userIndex] = {
        ...this.users[userIndex],
        password: String(newPassword),
      }

      return true
    },

    getCurrentUserFullData() {
      if (!this.currentUser) return null

      const user = this.users.find(u => u.id === this.currentUser.id)
      if (!user) return null

      // Return user data without password
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt,
      }
    },
  },
})
