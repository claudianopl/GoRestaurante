import { useCallback, useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface FoodsProps {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

function Dashboard() {
  const [foods, setFoods] = useState<FoodsProps[]>([]);
  const [editingFood, setEditingFood] = useState<FoodsProps>({} as FoodsProps);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const getFoods = useCallback(async () => {
    const response = await api.get('/foods');

    setFoods(response.data)
  }, [])

  useEffect(() => {
    getFoods();
  }, [getFoods])

  const handleAddFood = useCallback(async (food: FoodsProps) => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }, [foods])

  const handleUpdateFood = useCallback(async (food: FoodsProps) => {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }, [editingFood, foods])

  const handleDeleteFood = useCallback(async (id: number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }, [foods])

  const toggleModal = useCallback(() => {
    setModalOpen(currentModalOpen => !currentModalOpen)
  }, [])

  const toggleEditModal = useCallback(() => {
    setEditModalOpen(currentEditModalOpen => !currentEditModalOpen)
  }, [])

  const handleEditFood = useCallback((food: FoodsProps) => {
    setEditingFood(food);
    setEditModalOpen(true);
  }, [])

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  )
}

export default Dashboard;