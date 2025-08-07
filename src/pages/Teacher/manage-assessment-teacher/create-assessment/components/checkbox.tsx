import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  TextField,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DragDropContext,
  Draggable,
  DropResult,
  DraggableProvided,
} from "@hello-pangea/dnd";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { QuestionItem, TopicData } from "../type/type.create";
import ButtonAdd from "./buttonAdd";
import QuestionCard from "./QuestionCard";

type Props = {
  onDelete: () => void;
  onDuplicate: () => void;
  onChange: (data: TopicData) => void;
};

const Checkbox: React.FC<Props> = ({
  onDelete,
  onDuplicate,
  onChange,
}) => {
  const [questionSets, setQuestionSets] = useState<QuestionItem[]>([
    { id: 1, type: "checkbox", question: "", choices: [""] },
  ]);
  const [nextId, setNextId] = useState(2);
  const [topicTitle, setTopicTitle] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [addAnchorEl, setAddAnchorEl] = useState<null | HTMLElement>(null);
  const addMenuOpen = Boolean(addAnchorEl);

  const handleClose = () => setAnchorEl(null);
  const handleAddMenuClick = (e: React.MouseEvent<HTMLElement>) =>
    setAddAnchorEl(e.currentTarget);
  const handleAddMenuClose = () => setAddAnchorEl(null);

  const handleDeleteAll = () => {
    setQuestionSets([{ id: 1, type: "checkbox", question: "", choices: [""] }]);
    setNextId(2);
    onDelete();
    handleClose();
  };

  const handleDuplicate = () => {
    onDuplicate();
    handleClose();
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(questionSets);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setQuestionSets(reordered);
  };

  const addQuestionSet = (type: QuestionItem["type"]) => {
    let newQuestion: QuestionItem;
    switch (type) {
      case "choice":
        newQuestion = {
          id: nextId,
          type: "choice",
          question: "",
          choices: [""],
        };
        break;
      case "checkbox":
        newQuestion = {
          id: nextId,
          type: "checkbox",
          question: "",
          choices: [""],
        };
        break;
      case "openques":
        newQuestion = {
          id: nextId,
          type: "openques",
          question: "",
        };
        break;
      case "complacent":
        newQuestion = {
          id: nextId,
          type: "complacent",
          question: "",
        };
        break;
      default:
        throw new Error("Unknown question type");
    }
    setQuestionSets((prev) => [...prev, newQuestion]);
    setNextId((id) => id + 1);
    handleClose();
  };

  const updateQuestionText = (id: number, text: string) => {
    setQuestionSets((prev) =>
      prev.map((q) => (q.id === id ? { ...q, question: text } : q))
    );
  };

  const updateChoiceText = (id: number, idx: number, text: string) => {
    setQuestionSets((prev) =>
      prev.map((q) => {
        if (q.id === id && "choices" in q) {
          const choices = [...q.choices];
          choices[idx] = text;
          return { ...q, choices };
        }
        return q;
      })
    );
  };

  const addChoice = (id: number) => {
    setQuestionSets((prev) =>
      prev.map((q) =>
        q.id === id && "choices" in q
          ? { ...q, choices: [...q.choices, ""] }
          : q
      )
    );
  };

  const removeChoice = (id: number, idx: number) => {
    setQuestionSets((prev) =>
      prev.map((q) => {
        if (q.id === id && "choices" in q) {
          const choices = q.choices.filter((_, i) => i !== idx);
          return { ...q, choices: choices.length ? choices : [""] };
        }
        return q;
      })
    );
  };

  const removeQuestionSet = (id: number) => {
    const remain = questionSets.filter((q) => q.id !== id);
    setQuestionSets(
      remain.length
        ? remain
        : [{ id: 1, type: "checkbox", question: "", choices: [""] }]
    );
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
    <div className="border border-gray-400 w-180 rounded-md p-4 bg-white">
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

export default Checkbox;
