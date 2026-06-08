// store/roomStore.js
import { create } from 'zustand';

export const useRoomStore = create((set, get) => ({
  objects: [],
  selectedObjectId: null,
  
  addObject: (type, position) => {
    const newObject = {
      id: `${type}_${Date.now()}`,
      type: type,
      position: position,
      rotation: 0,
      name: type === 'table4' ? 'Table 4 places' :
            type === 'table2' ? 'Table 2 places' :
            type === 'table1' ? 'Table individuelle' :
            type === 'chair' ? 'Chaise' : 'Bureau enseignant'
    };
    set((state) => ({ objects: [...state.objects, newObject] }));
  },
  
  updateObjectPosition: (id, position) => {
    set((state) => ({
      objects: state.objects.map(obj => 
        obj.id === id ? { ...obj, position } : obj
      )
    }));
  },
  
  updateObjectRotation: (id, rotation) => {
    set((state) => ({
      objects: state.objects.map(obj => 
        obj.id === id ? { ...obj, rotation: (obj.rotation + 90) % 360 } : obj
      )
    }));
  },
  
  deleteObject: (id) => {
    set((state) => ({
      objects: state.objects.filter(obj => obj.id !== id),
      selectedObjectId: state.selectedObjectId === id ? null : state.selectedObjectId
    }));
  },
  
  selectObject: (id) => {
    set({ selectedObjectId: id });
  },
  
  clearSelection: () => {
    set({ selectedObjectId: null });
  },
  
  getObjects: () => get().objects,
  getSelectedObject: () => {
    const { objects, selectedObjectId } = get();
    return objects.find(obj => obj.id === selectedObjectId);
  },
  
  saveLayout: () => {
    const layout = get().objects;
    localStorage.setItem('room_layout', JSON.stringify(layout));
    return layout;
  },
  
  loadLayout: () => {
    const saved = localStorage.getItem('room_layout');
    if (saved) {
      set({ objects: JSON.parse(saved) });
    }
  }
}));