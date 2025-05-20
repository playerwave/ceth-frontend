import { Box, MenuItem, TextField } from "@mui/material";
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const CreateRoomAdmin = () => {
    const [floor, setFloor] = useState("");

    const handleFloorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFloor(e.target.value);
    };
    const navigate = useNavigate();

    return (
        <Box className="max-w-6xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg h-200">
            <h1 className="text-2xl font-bold mb-8">เพิ่มห้อง</h1>


            <form >
                {/* คณะ */}
                <div >

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
                            onClick={() => navigate('/list-room')}
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
    );
};

export default CreateRoomAdmin;