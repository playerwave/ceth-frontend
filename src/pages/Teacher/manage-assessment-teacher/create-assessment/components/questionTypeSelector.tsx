import React, { useRef } from "react";

const QuestionTypeSelector = ({
    onSelect
}: {
    onSelect: (type: string) => void;
}) => {
    const selectRef = useRef<HTMLSelectElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value) {
            onSelect(value);
            if (selectRef.current) {
                selectRef.current.value = ""; // reset dropdown
            }
        }
    };

    return (
        <div >
           
            <select
                ref={selectRef}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-lg text-sm w-[300px] bg-white"
                defaultValue=""
            >
                <option value="" disabled>เพิ่มคำถาม</option>
                <option value="complacent">ความพึงพอใจ</option>
                <option value="choice">ตัวเลือก</option>
                <option value="checkbox">CheckBox</option>
                <option value="openques">คำถามปลายปิด / เปิด</option>
            </select>
        </div>
    );
};

export default QuestionTypeSelector;
