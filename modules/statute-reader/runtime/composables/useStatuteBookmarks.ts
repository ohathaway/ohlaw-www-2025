import type { LegalUnit } from '../types'

export interface StatuteBookmark {
  id: string
  citation: string
  name?: string
  unit_type: string
  publication_name?: string
  jurisdiction_name?: string
  bookmarked_at: string
  notes?: string
  tags?: string[]
  folder?: string
}

export const useStatuteBookmarks = () => {
  // Reactive state for bookmarks
  const bookmarks = ref<StatuteBookmark[]>([])
  const folders = ref<string[]>(['General'])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Persistent storage keys
  const BOOKMARKS_KEY = 'statute-bookmarks'
  const FOLDERS_KEY = 'statute-bookmark-folders'

  // Load bookmarks from localStorage on initialization
  const loadBookmarks = () => {
    try {
      const stored = localStorage.getItem(BOOKMARKS_KEY)
      if (stored) {
        bookmarks.value = JSON.parse(stored)
      }
      
      const storedFolders = localStorage.getItem(FOLDERS_KEY)
      if (storedFolders) {
        folders.value = JSON.parse(storedFolders)
      }
    } catch (error) {
      console.error('Failed to load bookmarks:', error)
    }
  }

  // Save bookmarks to localStorage
  const saveBookmarks = () => {
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks.value))
      localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders.value))
    } catch (error) {
      console.error('Failed to save bookmarks:', error)
    }
  }

  // Initialize bookmarks on first use
  onMounted(() => {
    loadBookmarks()
  })

  // Watch bookmarks for changes and auto-save
  watch(bookmarks, () => {
    saveBookmarks()
  }, { deep: true })

  watch(folders, () => {
    saveBookmarks()
  }, { deep: true })

  // Core bookmark functions
  const addBookmark = (
    unit: LegalUnit, 
    options: {
      notes?: string
      tags?: string[]
      folder?: string
    } = {}
  ): boolean => {
    try {
      // Check if already bookmarked
      if (isBookmarked(unit.citation)) {
        return false
      }

      const bookmark: StatuteBookmark = {
        id: generateBookmarkId(),
        citation: unit.citation,
        name: unit.name,
        unit_type: unit.unit_type,
        publication_name: unit.publication?.name,
        jurisdiction_name: unit.publication?.jurisdiction?.name,
        bookmarked_at: new Date().toISOString(),
        notes: options.notes,
        tags: options.tags || [],
        folder: options.folder || 'General'
      }

      bookmarks.value.push(bookmark)
      
      // Ensure folder exists
      if (bookmark.folder && !folders.value.includes(bookmark.folder)) {
        folders.value.push(bookmark.folder)
      }

      return true
    } catch (error) {
      console.error('Failed to add bookmark:', error)
      return false
    }
  }

  const removeBookmark = (citation: string): boolean => {
    try {
      const index = bookmarks.value.findIndex(b => b.citation === citation)
      if (index > -1) {
        bookmarks.value.splice(index, 1)
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to remove bookmark:', error)
      return false
    }
  }

  const toggleBookmark = (unit: LegalUnit, options?: any): boolean => {
    if (isBookmarked(unit.citation)) {
      return removeBookmark(unit.citation)
    } else {
      return addBookmark(unit, options)
    }
  }

  const updateBookmark = (citation: string, updates: Partial<StatuteBookmark>): boolean => {
    try {
      const bookmark = bookmarks.value.find(b => b.citation === citation)
      if (bookmark) {
        Object.assign(bookmark, updates)
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to update bookmark:', error)
      return false
    }
  }

  // Query functions
  const isBookmarked = (citation: string): boolean => {
    return bookmarks.value.some(b => b.citation === citation)
  }

  const getBookmark = (citation: string): StatuteBookmark | null => {
    return bookmarks.value.find(b => b.citation === citation) || null
  }

  const getBookmarksByFolder = (folder: string): StatuteBookmark[] => {
    return bookmarks.value.filter(b => b.folder === folder)
  }

  const getBookmarksByTag = (tag: string): StatuteBookmark[] => {
    return bookmarks.value.filter(b => b.tags?.includes(tag))
  }

  const searchBookmarks = (query: string): StatuteBookmark[] => {
    if (!query.trim()) return bookmarks.value

    const searchTerm = query.toLowerCase().trim()
    return bookmarks.value.filter(bookmark => 
      bookmark.citation.toLowerCase().includes(searchTerm) ||
      bookmark.name?.toLowerCase().includes(searchTerm) ||
      bookmark.notes?.toLowerCase().includes(searchTerm) ||
      bookmark.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }

  // Folder management
  const createFolder = (name: string): boolean => {
    if (!name.trim() || folders.value.includes(name)) {
      return false
    }
    
    folders.value.push(name)
    return true
  }

  const renameFolder = (oldName: string, newName: string): boolean => {
    if (!newName.trim() || folders.value.includes(newName)) {
      return false
    }

    const index = folders.value.indexOf(oldName)
    if (index > -1) {
      folders.value[index] = newName
      
      // Update all bookmarks in this folder
      bookmarks.value.forEach(bookmark => {
        if (bookmark.folder === oldName) {
          bookmark.folder = newName
        }
      })
      
      return true
    }
    
    return false
  }

  const deleteFolder = (name: string): boolean => {
    if (name === 'General') {
      return false // Cannot delete default folder
    }

    const index = folders.value.indexOf(name)
    if (index > -1) {
      folders.value.splice(index, 1)
      
      // Move bookmarks to General folder
      bookmarks.value.forEach(bookmark => {
        if (bookmark.folder === name) {
          bookmark.folder = 'General'
        }
      })
      
      return true
    }
    
    return false
  }

  const moveBookmarkToFolder = (citation: string, folder: string): boolean => {
    const bookmark = getBookmark(citation)
    if (bookmark && folders.value.includes(folder)) {
      bookmark.folder = folder
      return true
    }
    return false
  }

  // Tag management
  const getAllTags = (): string[] => {
    const tagSet = new Set<string>()
    bookmarks.value.forEach(bookmark => {
      bookmark.tags?.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }

  const addTagToBookmark = (citation: string, tag: string): boolean => {
    const bookmark = getBookmark(citation)
    if (bookmark) {
      if (!bookmark.tags) {
        bookmark.tags = []
      }
      if (!bookmark.tags.includes(tag)) {
        bookmark.tags.push(tag)
        return true
      }
    }
    return false
  }

  const removeTagFromBookmark = (citation: string, tag: string): boolean => {
    const bookmark = getBookmark(citation)
    if (bookmark && bookmark.tags) {
      const index = bookmark.tags.indexOf(tag)
      if (index > -1) {
        bookmark.tags.splice(index, 1)
        return true
      }
    }
    return false
  }

  // Export/Import functionality
  const exportBookmarks = (): string => {
    const exportData = {
      bookmarks: bookmarks.value,
      folders: folders.value,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }
    return JSON.stringify(exportData, null, 2)
  }

  const importBookmarks = (jsonData: string, merge = false): boolean => {
    try {
      const importData = JSON.parse(jsonData)
      
      if (!importData.bookmarks || !Array.isArray(importData.bookmarks)) {
        throw new Error('Invalid bookmark data format')
      }

      if (merge) {
        // Merge with existing bookmarks
        const existingCitations = new Set(bookmarks.value.map(b => b.citation))
        const newBookmarks = importData.bookmarks.filter(
          (b: StatuteBookmark) => !existingCitations.has(b.citation)
        )
        bookmarks.value.push(...newBookmarks)
        
        // Merge folders
        const newFolders = importData.folders?.filter(
          (f: string) => !folders.value.includes(f)
        ) || []
        folders.value.push(...newFolders)
      } else {
        // Replace all bookmarks
        bookmarks.value = importData.bookmarks
        folders.value = importData.folders || ['General']
      }
      
      return true
    } catch (error) {
      console.error('Failed to import bookmarks:', error)
      return false
    }
  }

  const clearAllBookmarks = (): void => {
    bookmarks.value = []
    folders.value = ['General']
  }

  // Computed properties
  const bookmarkCount = computed(() => bookmarks.value.length)
  
  const folderCounts = computed(() => {
    const counts: Record<string, number> = {}
    folders.value.forEach(folder => {
      counts[folder] = getBookmarksByFolder(folder).length
    })
    return counts
  })

  const sortedBookmarks = computed(() => {
    return [...bookmarks.value].sort((a, b) => 
      new Date(b.bookmarked_at).getTime() - new Date(a.bookmarked_at).getTime()
    )
  })

  // Utility functions
  const generateBookmarkId = (): string => {
    return `bookmark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const formatBookmarkDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return 'Unknown'
    }
  }

  return {
    // Reactive state
    bookmarks: readonly(bookmarks),
    folders: readonly(folders),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Computed
    bookmarkCount,
    folderCounts,
    sortedBookmarks,

    // Core functions
    addBookmark,
    removeBookmark,
    toggleBookmark,
    updateBookmark,
    
    // Query functions
    isBookmarked,
    getBookmark,
    getBookmarksByFolder,
    getBookmarksByTag,
    searchBookmarks,
    
    // Folder management
    createFolder,
    renameFolder,
    deleteFolder,
    moveBookmarkToFolder,
    
    // Tag management
    getAllTags,
    addTagToBookmark,
    removeTagFromBookmark,
    
    // Import/Export
    exportBookmarks,
    importBookmarks,
    clearAllBookmarks,
    
    // Utilities
    formatBookmarkDate,
    
    // Manual operations
    loadBookmarks,
    saveBookmarks
  }
}