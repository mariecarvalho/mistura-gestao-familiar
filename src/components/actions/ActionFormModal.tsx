import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Action, ActionFormData } from '@/models/Action';
import { createAction, updateAction } from '@/services/actionService';

interface ActionFormModalProps {
  action?: Action;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function ActionFormModal({ action, isOpen, onClose, onSave }: ActionFormModalProps) {
  const [formData, setFormData] = useState<ActionFormData>({
    title: action?.title || '',
    description: action?.description || '',
    date: action?.date || '',
    type: action?.type || '',
    status: action?.status || 'Planejada',
    volunteer_count: action?.volunteer_count || 0,
    families_served: action?.families_served || 0,
    dishOfTheDay: action?.dishOfTheDay || '',
    actionCost: action?.actionCost || 0,
  });

  useEffect(() => {
    if (action) {
      setFormData({
        title: action.title,
        description: action.description,
        date: action.date,
        type: action.type,
        status: action.status,
        volunteer_count: action.volunteer_count,
        families_served: action.families_served,
        dishOfTheDay: action.dishOfTheDay,
        actionCost: action.actionCost,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        date: '',
        type: '',
        status: 'Planejada',
        volunteer_count: 0,
        families_served: 0,
        dishOfTheDay: '',
        actionCost: 0,
      });
    }
  }, [action]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (action) {
        await updateAction(action.id, formData);
      } else {
        await createAction(formData);
      }
      
      onSave();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar ação:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
      <ModalContent>
        {(closeModal) => (
          <form onSubmit={handleSubmit}>
            <ModalHeader className="flex flex-col gap-1">
              {action ? 'Editar Ação' : 'Nova Ação'}
            </ModalHeader>
            <ModalBody>
              <Input
                type="text"
                label="Título"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                isRequired
              />
              <Textarea
                label="Descrição"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                isRequired
              />
              <Input
                type="date"
                label="Data"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                isRequired
              />
              <Select
                label="Tipo"
                name="type"
                selectedKeys={[formData.type]}
                onSelectionChange={(value) => setFormData({ ...formData, type: value.currentKey || '' })}
                isRequired
              >
                <SelectItem key="Distribuição de Alimentos" value="Distribuição de Alimentos">Distribuição de Alimentos</SelectItem>
                <SelectItem key="Apoio Médico" value="Apoio Médico">Apoio Médico</SelectItem>
                <SelectItem key="Apoio Jurídico" value="Apoio Jurídico">Apoio Jurídico</SelectItem>
                <SelectItem key="Outro" value="Outro">Outro</SelectItem>
              </Select>
              <Select
                label="Status"
                name="status"
                selectedKeys={[formData.status]}
                onSelectionChange={(value) => setFormData({ ...formData, status: value.currentKey || '' })}
                isRequired
              >
                <SelectItem key="Planejada" value="Planejada">Planejada</SelectItem>
                <SelectItem key="Em Andamento" value="Em Andamento">Em Andamento</SelectItem>
                <SelectItem key="Concluída" value="Concluída">Concluída</SelectItem>
                <SelectItem key="Cancelada" value="Cancelada">Cancelada</SelectItem>
              </Select>
              <Input
                type="number"
                label="Número de Voluntários"
                name="volunteer_count"
                value={formData.volunteer_count?.toString()}
                onChange={handleInputChange}
                isRequired
              />
              <Input
                type="number"
                label="Número de Famílias Servidas"
                name="families_served"
                value={formData.families_served?.toString()}
                onChange={handleInputChange}
                isRequired
              />
               <Input
                type="text"
                label="Prato do Dia"
                name="dishOfTheDay"
                value={formData.dishOfTheDay}
                onChange={handleInputChange}
                
              />
               <Input
                type="number"
                label="Custo da Ação"
                name="actionCost"
                value={formData.actionCost?.toString()}
                onChange={handleInputChange}
                
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cancelar
              </Button>
              <Button color="primary" type="submit">
                {action ? 'Salvar' : 'Criar'}
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
