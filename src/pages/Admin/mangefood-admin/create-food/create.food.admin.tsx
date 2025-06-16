import { Box, TextField } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import Button from "../../../../components/Button";

const CreateFoodAdmin = () => {
    const navigate = useNavigate();

    return (
        <>
            {/* Mobile & iPad - Fixed Layout */}
            <Box className="flex lg:hidden h-screen bg-white flex-col">

                {/* Scrollable Container */}
               <div className="flex-1 overflow-y-auto">
                    {/* Form Content */}
                    <div className="p-4 pb-20">
                        <h2 className="text-xl font-bold mb-6 text-gray-800">เพิ่มเมนูอาหาร</h2>

                        <form className="space-y-6">
                            {/* ชื่ออาหาร */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    ชื่ออาหาร <span className="text-red-500">*</span>
                                </label>
                                <TextField
                                    type="text"
                                    placeholder="ชื่ออาหาร"
                                    variant="outlined"
                                    fullWidth
                                    size="medium"
                                    sx={{
                                        backgroundColor: 'white',
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#d1d5db',
                                            },
                                        },
                                    }}
                                />
                            </div>

                            {/* ราคา */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    ราคา <span className="text-red-500">*</span>
                                </label>
                                <TextField
                                    type="number"
                                    placeholder="ราคาของเมนูอาหาร"
                                    variant="outlined"
                                    fullWidth
                                    size="medium"
                                    sx={{
                                        backgroundColor: 'white',
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#d1d5db',
                                            },
                                        },
                                    }}
                                />
                            </div>

                            {/* เบอร์โทร */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    เบอร์โทร <span className="text-red-500">*</span>
                                </label>
                                <TextField
                                    type="tel"
                                    placeholder="เบอร์โทร"
                                    variant="outlined"
                                    fullWidth
                                    size="medium"
                                    sx={{
                                        backgroundColor: 'white',
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#d1d5db',
                                            },
                                        },
                                    }}
                                />

                            </div>
                        </form>
                    </div>
                </div>

                {/* Fixed Bottom Buttons */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden">
                    <div className="flex justify-between gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/list-food')}
                            className=" w-30 px-4 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full text-md"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            className=" w-30 px-4 py-1 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-full text-md"
                        >
                            บันทึกเมนู
                        </button>
                    </div>
                </div>

            </Box>

            {/* Desktop & Laptop - Original Card Layout */}
            <Box className="hidden lg:block justify-items-center">
                <div className="w-320 mx-auto ml-2xl mt-30 mb-5 p-6 border bg-white border-gray-200 rounded-lg shadow-xl flex flex-col h-200">
                    <h1 className="text-3xl font-bold mb-5">เพิ่มเมนูอาหาร</h1>
                    <form className="space-y-6">
                        {/* ชื่ออาหาร */}
                        <div className="grid mt-8">
                            <label className="w-96 text-left font-semibold mb-1">
                                ชื่ออาหาร <span className="text-red-500">*</span>
                            </label>
                            <TextField
                                type="text"
                                placeholder="ชื่ออาหาร"
                                className="w-2xl border border-gray-300 rounded px-3 py-2"
                            />
                        </div>

                        {/* ราคา */}
                        <div className="grid mt-8">
                            <label className="w-96 text-left font-semibold mb-1">
                                ราคา <span className="text-red-500">*</span>
                            </label>
                            <TextField
                                type="number"
                                placeholder="ราคาของเมนูอาหาร"
                                className="w-2xl border border-gray-300 rounded px-3 py-2"
                            />
                        </div>

                        {/* เบอร์โทร */}
                        <div className="grid mt-8">
                            <label className="w-96 text-left font-semibold mb-1">
                                เบอร์โทร <span className="text-red-500">*</span>
                            </label>
                            <TextField
                                type="tel"
                                placeholder="เบอร์โทร"
                                className="w-2xl border border-gray-300 rounded px-3 py-2"
                            />
                        </div>

                        {/* ปุ่ม */}
                        <div className="col-span-2 flex justify-end gap-4 mt-75">
                            <Button
                                type="button"
                                bgColor="red"
                                onClick={() => navigate('/list-food')}
                            >
                                ยกเลิก
                            </Button>
                            <Button
                                type="submit"
                            >
                                บันทึก
                            </Button>
                        </div>
                    </form>
                </div>
            </Box>
        </>
    )
}

export default CreateFoodAdmin