
import { Box, TextField } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import Button from "../../../../components/Button";

const CreateFoodAdmin = () => {

      const navigate = useNavigate();

    return (
        <>
            <Box className="justify-items-center  ">
                <div className={` w-320 mx-auto ml-2xl mt-30 mb-5 p-6 border bg-white border-gray-200 rounded-lg shadow-xl flex flex-col  h-200`}  >
                    <h1 className="text-3xl font-bold mb-8">เพิ่มเมนูอาหาร</h1>
                    <form className="space-y-6">
                        {/* ชื่ออาหาร */}
                        <div className="grid mt-5">
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
                        <div className="grid  mt-5">
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
                        <div className="grid mt-5">
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
                                            <div className="col-span-2 flex justify-end gap-4 mt-75">
                        <Button
                            type="button"
                           color="red"
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