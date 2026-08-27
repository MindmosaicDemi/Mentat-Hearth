import { db } from '../db/schema';
import type { Concern } from '../db/schema';

export const useConcerns = () => {
  const addConcern = async (concern: Omit<Concern, 'id'>) => {
    await db.concerns.add({ ...concern, id: crypto.randomUUID() });
  };

  const getConcerns = async () => {
    return await db.concerns.toArray();
  };

  const getConcernsByCluster = async (cluster: string) => {
    return await db.concerns.where('cluster').equals(cluster).toArray();
  };

  const updateConcernStrength = async (id: string, strength: number) => {
    await db.concerns.update(id, { strength });
  };

  const deleteConcern = async (id: string) => {
    await db.concerns.delete(id);
  };

  return {
    addConcern,
    getConcerns,
    getConcernsByCluster,
    updateConcernStrength,
    deleteConcern,
  };
};
