import { useLocalStorage } from './useLocalStorage';

const isCollapsed = useLocalStorage('sidebar-collapsed', false);

export const useSidebar = () => {
  const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value;
  };

  const setSidebar = (value: boolean) => {
    isCollapsed.value = value;
  };

  return {
    isCollapsed,
    toggleSidebar,
    setSidebar,
  };
};
