import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TextField, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProvided,
  DraggableProvided,
} from "@hello-pangea/dnd";

import ButtonAdd from './buttonAdd';
import QuestionCard from './QuestionCard';

// ✅ Import types จากไฟล์รวม type
import { QuestionItem, TopicData } from '../type/type.create';

type Props = {
  onDelete: () => void;
  onDuplicate: () => void;
  onChange: (data: TopicData) => void;
};

const Choice = ({ onDelete, onDuplicate, onChange }: Props) => {
  const [questionSets, setQuestionSets] = useState<QuestionItem[]>([
    { id: 1, type: "choice", question: '', choices: [''] }
  ]);
  const [nextId, setNextId] = useState(2);
  const [topicTitle, setTopicTitle] = useState('');
  const [addAnchorEl, setAddAnchorEl] = useState<null | HTMLElement>(null);
  const addMenuOpen = Boolean(addAnchorEl);

  const handleAddMenuClick = (e: React.MouseEvent<HTMLElement>) => setAddAnchorEl(e.currentTarget);
  const handleAddMenuClose = () => setAddAnchorEl(null);

  const addQuestionSet = (type: QuestionItem["type"]) => {
    let newQuestion: QuestionItem;
    switch (type) {
      case "choice":
        newQuestion = { id: nextId, type: "choice", question: '', choices: [''] };
        break;
      case "checkbox":
        newQuestion = { id: nextId, type: "checkbox", question: '', choices: [''] };
        break;
      case "openques":
        newQuestion = { id: nextId, type: "openques", question: '' };
        break;
      case "complacent":
        newQuestion = { id: nextId, type: "complacent", question: '' };
        break;
      default:
        return;
    }
    setQuestionSets([...questionSets, newQuestion]);
    setNextId(nextId + 1);
    handleAddMenuClose();
  };

  const addChoice = (id: number) => {
    setQuestionSets(
      questionSets.map((q) =>
        q.id === id && 'choices' in q
          ? { ...q, choices: [...q.choices, ''] }
          : q
      )
    );
  };


  const updateChoiceText = (questionId: number, choiceIndex: number, newText: string) => {
    setQuestionSets(
      questionSets.map((q) => {
        if (q.id === questionId && 'choices' in q) {
          const updatedChoices = [...q.choices];
          updatedChoices[choiceIndex] = newText;
          return { ...q, choices: updatedChoices };
        }
        return q;
      })
    );
  };


  const updateQuestionText = (questionId: number, newText: string) => {
    setQuestionSets(
      questionSets.map((q) =>
        q.id === questionId ? { ...q, question: newText } : q
      )
    );
  };

  const removeQuestionSet = (id: number) => {
    const filtered = questionSets.filter(q => q.id !== id);
    setQuestionSets(filtered.length ? filtered : [{ id: 1, type: "choice", question: '', choices: [''] }]);
  };

  const removeChoice = (questionId: number, choiceIndex: number) => {
    setQuestionSets(
      questionSets.map((q) => {
        if (q.id === questionId && 'choices' in q) {
          const updatedChoices = q.choices.filter((_, idx) => idx !== choiceIndex);
          return { ...q, choices: updatedChoices.length ? updatedChoices : [''] };
        }
        return q;
      })
    );
  };

  const handleDeleteAll = () => {
    setQuestionSets([{ id: 1, type: "choice", question: '', choices: [''] }]);
    setNextId(2);
    onDelete();
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(questionSets);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setQuestionSets(reordered);
  };

  const handleDuplicate = () => {
    onDuplicate();
  };

const prevDataRef = useRef<string>("");

useEffect(() => {
  const payload: TopicData = {
    topic: topicTitle,
    questions: questionSets,
  };

  const serialized = JSON.stringify(payload);
  if (serialized !== prevDataRef.current) {
    prevDataRef.current = serialized;
    onChange(payload);
  }
}, [topicTitle, questionSets]);

  return (
    <div className='border border-gray-400 w-180 rounded-md p-4 bg-white'>
      <div className="flex items-center justify-between mb-3 px-3">
        <TextField
          placeholder="หัวเรื่องแบบประเมิน"
          className="w-140"
          value={topicTitle}
          onChange={(e) => setTopicTitle(e.target.value)}
        />
        <div className="flex gap-2">
          <IconButton type="button" onClick={handleDuplicate}>
            <ContentCopyIcon />
          </IconButton>
          <IconButton type="button" color="error" onClick={handleDeleteAll}>
            <DeleteIcon />
          </IconButton>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="questions-droppable">
          {(provided: DroppableProvided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {questionSets.map((q, idx) => (
                <Draggable key={q.id} draggableId={`question-${q.id}`} index={idx}>
                  {(provided: DraggableProvided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="bg-white rounded-xl shadow border border-gray-200 mb-4 p-4"
                    >
                      <QuestionCard
                        question={q}
                        updateQuestionText={updateQuestionText}
                        updateChoiceText={updateChoiceText}
                        addChoice={addChoice}
                        removeChoice={removeChoice}
                        removeQuestionSet={removeQuestionSet}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="flex justify-center mt-6">
        <ButtonAdd
          anchorEl={addAnchorEl}
          menuOpen={addMenuOpen}
          onMenuClick={handleAddMenuClick}
          onMenuClose={handleAddMenuClose}
          onAdd={addQuestionSet}
        />
      </div>
    </div>
  );
};

export default Choice;
