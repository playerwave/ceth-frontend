import { Box, TextField } from "@mui/material";
import React, { useState } from 'react';
import Button from "../../../../components/Button";
import { Trash2 } from 'lucide-react';
import DeleteConfirmDialog from '../edit-food/components/delete.dialog.food';
import { useNavigate } from 'react-router-dom'


const EditFoodAdmin = () => {
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        console.log("ลบเมนูอาหาร...");
        setOpen(false);
    };




    const navigate = useNavigate();

    return (
        <>
            <Box className="justify-items-center">
                <div className="w-320 mx-auto ml-2xl mt-30 mb-5 p-6 border bg-white border-gray-200 rounded-lg shadow-xl flex flex-col h-200">
                    {/* หัวข้อ + ปุ่มลบ */}
                    <div className="flex w-full mb-5">
                        <h1 className="text-4xl font-bold text-center w-full ml-30">
                            แก้ไขเมนูอาหาร
                        </h1>

                        <button
                            type="button"
                            onClick={() => setOpen(true)}
                            className="bg-red-600 text-white w-36 h-10 rounded-lg hover:bg-red-700 items-center justify-center flex"
                        >
                            <Trash2 /> ลบเมนูอาหาร
                        </button>
                    </div>

                    <form className="space-y-6">
                        {/* ชื่ออาหาร */}
                        <div className="grid justify-center mt-5">
                            <label className="w-96 text-left font-semibold mb-1">
                                ชื่ออาหาร <span className="text-red-500">*</span>
                            </label>
                            <TextField placeholder="ชื่ออาหาร" className="w-2xl" />
                        </div>

                        {/* ราคา */}
                        <div className="grid justify-center mt-5">
                            <label className="w-96 text-left font-semibold mb-1">
                                ราคา <span className="text-red-500">*</span>
                            </label>
                            <TextField placeholder="ราคาอาหาร" className="w-2xl" />
                        </div>

                        {/* เบอร์โทร */}
                        <div className="grid justify-center mt-5">
                            <label className="w-96 text-left font-semibold mb-1">
                                เบอร์โทร <span className="text-red-500">*</span>
                            </label>
                            <TextField placeholder="เบอร์โทรศัพท์" className="w-2xl" />
                        </div>

                        {/* ปุ่ม */}
                        <div className="flex justify-center gap-20 mt-30">
                            <button
                                type="submit"
                                className="bg-blue-800 text-white font-semibold px-6 py-2 rounded-xl w-40 hover:bg-blue-900"
                            >
                                บันทึกเมนู
                            </button>
                            <button
                                type="button"
                                className="bg-red-600 text-white font-semibold px-6 py-2 rounded-xl w-40 hover:bg-red-700"
                                onClick={() => navigate('/list-food')}
                            >
                                ยกเลิก
                            </button>
                        </div>
                    </form>
                </div>
            </Box>


            <DeleteConfirmDialog
                open={open}
                onClose={() => setOpen(false)}
                onConfirm={handleDelete}
            />
        </>
    );
};

export default EditFoodAdmin;