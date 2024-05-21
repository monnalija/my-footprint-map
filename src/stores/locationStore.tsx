import {create} from 'zustand';
import { Client } from '@notionhq/client';

// Notion 클라이언트 초기화
const notion = new Client({ auth: process.env.NEXT_PUBLIC_NOTION_API_KEY });

const useLocationStore = create((set, get) => ({
  locationItems: [],
  fetchLocations: async () => {
    try {
      console.log('ws dbid', process.env.NEXT_PUBLIC_NOTION_DATABASE_ID)
      const response = await notion.databases.query({
        database_id: process.env.NEXT_PUBLIC_NOTION_DATABASE_ID,
      });
      set({ locationItems: response.results });
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  },
  addItem: async (item) => {
    try {
      const response = await notion.pages.create({
        parent: { database_id: process.env.NEXT_PUBLIC_NOTION_DATABASE_ID },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: item.name,
                },
              },
            ],
          },
          Description: {
            rich_text: [
              {
                text: {
                  content: item.description,
                },
              },
            ],
          },
        },
      });
      get().fetchLocations(); // Fetch items again to update the state
    } catch (error) {
      console.error("Error adding item:", error);
    }
  },
  updateItem: async (id, properties) => {
    try {
      await notion.pages.update({
        page_id: id,
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: properties.name,
                },
              },
            ],
          },
          Description: {
            rich_text: [
              {
                text: {
                  content: properties.description,
                },
              },
            ],
          },
        },
      });
      get().fetchLocations(); // Fetch items again to update the state
    } catch (error) {
      console.error("Error updating item:", error);
    }
  },
  deleteItem: async (id) => {
    try {
      await notion.pages.update({
        page_id: id,
        archived: true,
      });
      get().fetchLocations(); // Fetch items again to update the state
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  },
}));

export default useLocationStore;
