
import { Box, TextField } from "@mui/material";
import { useNavigate } from 'react-router-dom';


const CreateFoodAdmin = () => {

      const navigate = useNavigate();

    return (
        <>
            <Box className="justify-items-center  ">
                <div className={` w-320 mx-auto ml-2xl mt-30 mb-5 p-6 border bg-white border-gray-200 rounded-lg shadow-xl flex flex-col  h-200`}  >
                    <h1 className="text-4xl font-bold mb-11 text-center mt-7">เพิ่มเมนูอาหาร</h1>
                    <form className="space-y-6">
                        {/* ชื่ออาหาร */}
                        <div className="grid justify-center mt-5">
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
                        <div className="grid justify-center mt-5">
                            <label className="w-96 text-left font-semibold mb-1">
                                ราคา <span className="text-red-500">*</span>
                            </label>
                            <TextField
                                type="text"
                                placeholder="ชื่ออาหาร"
                                className="w-2xl border border-gray-300 rounded px-3 py-2"
                            />
                        </div>

                        {/* เบอร์โทร */}
                        <div className="grid justify-center mt-5">
                            <label className="w-96 text-left font-semibold mb-1">
                                เบอร์โทร <span className="text-red-500">*</span>
                            </label>
                            <TextField
                                type="text"
                                placeholder="ชื่ออาหาร"
                                className="w-2xl border border-gray-300 rounded px-3 py-2"
                            />
                        </div>

                        {/* ปุ่ม */}
                        <div className="flex justify-center gap-20  mt-30">
                            <button
                                type="submit"
                                className="bg-blue-800 text-white font-semibold  px-6 py-2 rounded-xl w-40 hover:bg-blue-900"
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
        </>
    )
}

export default CreateFoodAdmin