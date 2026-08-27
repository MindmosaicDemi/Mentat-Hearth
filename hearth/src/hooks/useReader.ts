import { db } from '../db/schema';
import type { ReadingPosition } from '../db/schema';

export const useReader = () => {
  const saveReadingPosition = async (position: Omit<ReadingPosition, 'id' | 'updatedAt'>) => {
    await db.readingPositions.put({
      ...position,
      id: 'current',
      updatedAt: new Date().toISOString(),
    });
  };

  const getReadingPosition = async () => {
    return await db.readingPositions.get('current');
  };

  const clearReadingPosition = async () => {
    await db.readingPositions.delete('current');
  };

  return {
    saveReadingPosition,
    getReadingPosition,
    clearReadingPosition,
  };
};
