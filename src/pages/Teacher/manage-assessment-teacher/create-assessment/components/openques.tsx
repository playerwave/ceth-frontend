import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  TextField,
  IconButton,

} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

import { QuestionItem, TopicData } from "../type/type.create";
import QuestionCard from "./QuestionCard";
import ButtonAdd from "./buttonAdd"; // ปุ่มเพิ่มคำถามแบบเลือกประเภท

type Props = {
  onDelete: () => void;
  onDuplicate: () => void;
  onChange: (data: TopicData) => void;
};

const Openques = ({ onDelete, onDuplicate, onChange }: Props) => {
  const [questions, setQuestions] = useState<QuestionItem[]>([
    { id: 1, type: "openques", question: "" },
  ]);
  const [nextId, setNextId] = useState(2);
  const [topicTitle, setTopicTitle] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
 
  const [addAnchorEl, setAddAnchorEl] = useState<null | HTMLElement>(null);
  const addMenuOpen = Boolean(addAnchorEl);


  const handleClose = () => setAnchorEl(null);
  const handleAddMenuClick = (e: React.MouseEvent<HTMLElement>) => setAddAnchorEl(e.currentTarget);
  const handleAddMenuClose = () => setAddAnchorEl(null);

  const handleDeleteAll = () => {
    setQuestions([{ id: 1, type: "openques", question: "" }]);
    setNextId(2);
    onDelete();
    handleClose();
  };

  const handleDuplicate = () => {
    onDuplicate();
    handleClose();
  };

  const addQuestionSet = (type: QuestionItem["type"]) => {
    let newQuestion: QuestionItem;
    switch (type) {
      case "choice":
      case "checkbox":
        newQuestion = { id: nextId, type, question: "", choices: [""] };
        break;
      case "openques":
      case "complacent":
        newQuestion = { id: nextId, type, question: "" };
        break;
      default:
        return;
    }
    setQuestions((prev) => [...prev, newQuestion]);
    setNextId((id) => id + 1);
    handleAddMenuClose();
  };

  const updateQuestionText = useCallback((id: number, text: string) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, question: text } : q)));
  }, []);

  const updateChoiceText = useCallback((id: number, idx: number, text: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if ("choices" in q && q.id === id) {
          const updated = [...q.choices];
          updated[idx] = text;
          return { ...q, choices: updated };
        }
        return q;
      })
    );
  }, []);

  const addChoice = useCallback((id: number) => {
    setQuestions((prev) =>
      prev.map((q) =>
        "choices" in q && q.id === id ? { ...q, choices: [...q.choices, ""] } : q
      )
    );
  }, []);

  const removeChoice = useCallback((id: number, idx: number) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if ("choices" in q && q.id === id) {
          const updated = q.choices.filter((_, i) => i !== idx);
          return { ...q, choices: updated.length ? updated : [""] };
        }
        return q;
      })
    );
  }, []);

  const removeQuestionSet = useCallback((id: number) => {
    const filtered = questions.filter((q) => q.id !== id);
    setQuestions(filtered.length ? filtered : [{ id: 1, type: "openques", question: "" }]);
  }, [questions]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(questions);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setQuestions(reordered);
  };

const prevDataRef = useRef<string>("");

useEffect(() => {
  const payload: TopicData = {
    topic: topicTitle,
    questions: questions,
  };

  const serialized = JSON.stringify(payload);
  if (serialized !== prevDataRef.current) {
    prevDataRef.current = serialized;
    onChange(payload);
  }
}, [topicTitle, questions]);


  return (
    <div className="border border-gray-400 w-180 rounded-md p-4 bg-white">
      <div className="flex items-center justify-between mb-3 ml-3 mr-3">
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
        <Droppable droppableId="questions">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {questions.map((q, index) => (
                <Draggable key={q.id} draggableId={`question-${q.id}`} index={index}>
                  {(provided) => (
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

export default Openques;
