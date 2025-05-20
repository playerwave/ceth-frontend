import { Box, MenuItem, TextField } from "@mui/material";
import { Trash2 } from "lucide-react";
import React, { useState } from 'react';
import DeleteConfirmDialog from "./components/delete.dialog.food";

const EditRoomAdmin = () => {
    const [floor, setFloor] = useState("");

    const handleFloorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFloor(e.target.value);
    };



    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        console.log("ลบเมนูอาหาร...");
        setOpen(false);
    };
    return (
        <>
            <Box className="max-w-6xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg h-200">
                <div className="flex w-full mb-5">
                    <h1 className="text-4xl font-bold w-full ">แก้ไขห้อง</h1>


                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="bg-red-600 text-white w-36 h-10 rounded-lg hover:bg-red-700 items-center justify-center flex"
                    >
                        <Trash2 /> ลบเมนูอาหาร
                    </button>
                </div>
                <form >
                    {/* คณะ */}
                    <div className="mt-15">

                        <div className="flex flex-col w-133">
                            <label className="font-semibold mb-1">
                                คณะ <span className="text-red-500">*</span>
                            </label>
                            <TextField placeholder="คณะวิทยาการสารสนเทศ" fullWidth />
                        </div>



                        {/* ตึก / อาคาร */}
                        <div className="flex flex-col w-133">
                            <label className="font-semibold mb-1">
                                ตึก / อาคาร <span className="text-red-500">*</span>
                            </label>
                            <TextField placeholder="IF" fullWidth />
                        </div>


                        <div className="flex gap-x-6">
                            {/* เลือกชั้น */}
                            <div className="flex flex-col w-135">
                                <label className="font-semibold mb-1">
                                    เลือกชั้น <span className="text-red-500">*</span>
                                </label>
                                <TextField
                                    select
                                    value={floor}
                                    onChange={handleFloorChange}
                                    fullWidth
                                >
                                    {[...Array(11)].map((_, i) => (
                                        <MenuItem key={i + 1} value={i + 1}>
                                            ชั้น {i + 1}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </div>

                            {/* ชื่อห้อง */}
                            <div className="flex flex-col w-135">
                                <label className="font-semibold mb-1">
                                    ชื่อห้อง <span className="text-red-500">*</span>
                                </label>
                                <TextField placeholder="ชื่อห้อง" fullWidth />
                            </div>
                        </div>


                        {/* ที่นั่ง */}
                        <div className="flex flex-col w-133">
                            <label className="font-semibold mb-1">
                                ที่นั่ง <span className="text-red-500">*</span>
                            </label>
                            <TextField placeholder="จำนวนที่นั่งของห้อง" fullWidth />
                        </div>

                        {/* ปุ่ม */}
                        <div className="col-span-2 flex justify-end gap-4 mt-70">
                            <button
                                type="button"
                                className="bg-red-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-red-700"
                            >
                                ยกเลิก
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-800 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-900"
                            >
                                บันทึก
                            </button>
                        </div>
                    </div>
                </form>
            </Box>

            {/* ✅ ย้าย Dialog มาไว้ใน return */}
            <DeleteConfirmDialog
                open={open}
                onClose={() => setOpen(false)}
                onConfirm={handleDelete}
            />

        </>

    );

};

export default EditRoomAdmin