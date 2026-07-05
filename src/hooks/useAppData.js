import { useState, useEffect } from 'react';

// Keys for localStorage
const STORE_KEY = 'aa_app_data';

// Default application data structure
const DEFAULT_DATA = {
  commissionSlots: 3,
  commissionsOpen: true,
  userLikes: [],        // Array of painting IDs liked by the logged-in user
  userCommissions: []   // Array of commission request objects
};

/**
 * useAppData manages simulated backend data via localStorage.
 * This ensures the frontend operates seamlessly without a real database.
 */
export function useAppData() {
  const [appData, setAppData] = useState(DEFAULT_DATA);

  // Hydrate from localStorage on client side mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORE_KEY);
      if (stored) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAppData({ ...DEFAULT_DATA, ...JSON.parse(stored) });
      }
    } catch (e) {
      console.warn("Failed to load app data", e);
    }
  }, []);

  // Sync state to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(appData));
    
    // Dispatch a custom event so other components can re-render if needed
    window.dispatchEvent(new CustomEvent('appDataChanged', { detail: appData }));
  }, [appData]);

  // Listen for changes from other components/tabs
  useEffect(() => {
    const handleDataChange = (e) => {
      // Prevent infinite loop if the event came from this instance
      if (JSON.stringify(e.detail) !== JSON.stringify(appData)) {
        setAppData(e.detail);
      }
    };
    
    // Also listen to raw storage events for cross-tab sync
    const handleStorageChange = (e) => {
      if (e.key === STORE_KEY && e.newValue) {
        setAppData(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('appDataChanged', handleDataChange);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('appDataChanged', handleDataChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [appData]);

  // --- Helpers to update specific slices of data --- //

  const updateCommissionSettings = (isOpen, slots) => {
    setAppData(prev => ({
      ...prev,
      commissionsOpen: isOpen,
      commissionSlots: Math.max(0, parseInt(slots) || 0)
    }));
  };

  const toggleLike = (paintingId) => {
    setAppData(prev => {
      const isLiked = prev.userLikes.includes(paintingId);
      const newLikes = isLiked 
        ? prev.userLikes.filter(id => id !== paintingId)
        : [...prev.userLikes, paintingId];
      
      return { ...prev, userLikes: newLikes };
    });
  };

  const addCommissionRequest = (requestData) => {
    setAppData(prev => ({
      ...prev,
      userCommissions: [
        { ...requestData, id: Date.now().toString(), status: 'Pending', date: new Date().toISOString() },
        ...prev.userCommissions
      ]
    }));
  };

  return {
    appData,
    updateCommissionSettings,
    toggleLike,
    addCommissionRequest
  };
}
