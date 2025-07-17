// // components/AdminActivityForm/FoodMenuSection.tsx
// import { Box, IconButton, Paper, TextField, Typography } from "@mui/material";
// import { Add, Delete } from "@mui/icons-material";
// import Button from "../../../../../components/Button";
// import {CreateActivityForm} from "../create_activity_admin";

// interface Props {
//   formData: CreateActivityForm;
//   updateFoodOption: (index: number, value:number) => void;

//   removeFoodOption: (index: number) => void;
//   addFoodOption: () => void;
// }

// const FoodMenuSection: React.FC<Props> = ({
//   formData,
//   updateFoodOption,
//   removeFoodOption,
//   addFoodOption,
// }) => {
//   return (
//     <Paper
//       className={`w-140 mt-5 p-6 bg-white border border-gray-300 rounded-lg shadow-sm ${
//         formData.event_format !== "Onsite" ? "opacity-50" : ""
//       }`}
//     >
//       <Typography variant="h6" className="font-semibold mb-2">
//         อาหาร *
//       </Typography>

//       {/* เมนูอาหาร */}
//       {/* <Box className="pr-2 space-y-2 flex flex-col">
//         {formData.?.map((menu: string, index: number) => (
//           <Box key={index} className="flex items-center space-x-2">
//             <TextField
//               fullWidth
//               value={menu}
//               onChange={(e) => updateFoodOption(index, Number(e.target.value))}
//               variant="outlined"
//               size="small"
//               className="border-gray-400 rounded"
//               disabled={formData.event_format !== "Onsite"}
//             />
//             <IconButton
//               onClick={() => removeFoodOption(index)}
//               color="error"
//               disabled={formData.event_format !== "Onsite"}
//             >
//               <Delete />
//             </IconButton>
//           </Box>
//         ))}
//       </Box> */}
//       {formData.selectedFoods.map((menuId: number, index: number) => (
//   <Box key={index} className="flex items-center space-x-2">
//     <TextField
//       fullWidth
//       value={menuId.toString()} // แปลงเป็น string เพื่อให้ TextField รับค่าได้
//       onChange={(e) => {
//         const value = Number(e.target.value);
//         updateFoodOption(index, isNaN(value) ? 0 : value); // หรือจะ block NaN ก็ได้
//       }}
//       variant="outlined"
//       size="small"
//       className="border-gray-400 rounded"
//       disabled={formData.event_format !== "Onsite"}
//     />
//     <IconButton
//       onClick={() => removeFoodOption(index)}
//       color="error"
//       disabled={formData.event_format !== "Onsite"}
//     >
//       <Delete />
//     </IconButton>
//   </Box>
// ))}



//       {/* ปุ่มเพิ่มเมนู */}
//       {formData.event_format === "Onsite" && (
//         <Box className="flex justify-end mt-2">
//           <Button
//             onClick={addFoodOption}
//             variant="contained"
//             bgColor="blue"
//             startIcon={<Add />}
//             className="mt-4 text-white"
//           >
//             เพิ่มอาหาร
//           </Button>
//         </Box>
//       )}
//     </Paper>
//   );
// };

// export default FoodMenuSection;

//version 2
// import {
//   Box,
//   IconButton,
//   Paper,
//   Typography,
//   Autocomplete,
//   TextField,
// } from "@mui/material";
// import { Add, Delete } from "@mui/icons-material";
// import Button from "../../../../../components/Button";
// import { CreateActivityForm } from "../create_activity_admin";
// import { useFoodStore } from "../../../../../stores/Teacher/food.store.teacher"; // ✅ ปรับ path ให้ถูก

// interface Props {
//   formData: CreateActivityForm;
//   updateFoodOption: (index: number, value: number) => void;
//   removeFoodOption: (index: number) => void;
//   addFoodOption: () => void;
// }

// const FoodMenuSection: React.FC<Props> = ({
//   formData,
//   updateFoodOption,
//   removeFoodOption,
//   addFoodOption,
// }) => {
//   const foods = useFoodStore((state) => state.foods);

//   return (
//     <Paper
//       className={`w-140 mt-5 p-6 bg-white border border-gray-300 rounded-lg shadow-sm ${
//         formData.event_format !== "Onsite" ? "opacity-50" : ""
//       }`}
//     >
//       <Typography variant="h6" className="font-semibold mb-2">
//         อาหาร *
//       </Typography>

//       {/* AutoComplete List */}
//       <Box className="pr-2 space-y-2 flex flex-col">
//         {formData.selectedFoods.map((foodId: number, index: number) => {
//           const selectedFood = foods.find((f) => f.id === foodId) ?? null;

//           return (
//             <Box key={index} className="flex items-center space-x-2">
//               <Autocomplete
//                 options={foods}
//                 getOptionLabel={(option) => option.name}
//                 value={selectedFood}
//                 isOptionEqualToValue={(option, value) => option.id === value.id}
//                 onChange={(_, newValue) => {
//                   updateFoodOption(index, newValue?.id ?? 0);
//                 }}
//                 disabled={formData.event_format !== "Onsite"}
//                 renderInput={(params) => (
//                   <TextField {...params} label="เลือกอาหาร" size="small" />
//                 )}
//                 className="flex-grow"
//               />
//               <IconButton
//                 onClick={() => removeFoodOption(index)}
//                 color="error"
//                 disabled={formData.event_format !== "Onsite"}
//               >
//                 <Delete />
//               </IconButton>
//             </Box>
//           );
//         })}
//       </Box>

//       {/* Add Food Button */}
//       {formData.event_format === "Onsite" && (
//         <Box className="flex justify-end mt-2">
//           <Button
//             onClick={addFoodOption}
//             variant="contained"
//             bgColor="blue"
//             startIcon={<Add />}
//             className="mt-4 text-white"
//           >
//             เพิ่มอาหาร
//           </Button>
//         </Box>
//       )}
//     </Paper>
//   );
// };

// export default FoodMenuSection;


// import {
//   Box,
//   IconButton,
//   Paper,
//   Typography,
// } from "@mui/material";
// import { Delete } from "@mui/icons-material";
// import { CreateActivityForm } from "../create_activity_admin";
// import { useFoodStore } from "../../../../../stores/Teacher/food.store.teacher";
// import useAutocomplete from "@mui/material/useAutocomplete";
// import CheckIcon from "@mui/icons-material/Check";
// import { styled } from "@mui/material/styles";
// import { autocompleteClasses } from "@mui/material/Autocomplete";
// import React, {useEffect} from "react";

// const Root = styled("div")(({ theme }) => ({
//   color: "rgba(0,0,0,0.85)",
//   fontSize: "14px",
// }));

// const Label = styled("label")`
//   padding: 0 0 4px;
//   line-height: 1.5;
//   display: block;
// `;

// const InputWrapper = styled("div")(({ theme }) => ({
//   width: "100%",
//   border: "1px solid #d9d9d9",
//   backgroundColor: "#fff",
//   borderRadius: "4px",
//   padding: "1px",
//   display: "flex",
//   flexWrap: "wrap",
//   '& input': {
//     backgroundColor: "#fff",
//     color: "rgba(0,0,0,.85)",
//     height: "30px",
//     padding: "4px 6px",
//     width: "0",
//     minWidth: "30px",
//     flexGrow: 1,
//     border: 0,
//     margin: 0,
//     outline: 0,
//   },
// }));

// const Listbox = styled("ul")(({ theme }) => ({
//   width: "100%",
//   margin: "2px 0 0",
//   padding: 0,
//   position: "absolute",
//   listStyle: "none",
//   backgroundColor: "#fff",
//   overflow: "auto",
//   maxHeight: "250px",
//   borderRadius: "4px",
//   boxShadow: "0 2px 8px rgb(0 0 0 / 0.15)",
//   zIndex: 1,
//   '& li': {
//     padding: "5px 12px",
//     display: "flex",
//     '& span': {
//       flexGrow: 1,
//     },
//     '& svg': {
//       color: "transparent",
//     },
//   },
//   "& li[aria-selected='true']": {
//     backgroundColor: "#fafafa",
//     fontWeight: 600,
//     '& svg': {
//       color: "#1890ff",
//     },
//   },
//   [`& li.${autocompleteClasses.focused}`]: {
//     backgroundColor: "#e6f7ff",
//     cursor: "pointer",
//     '& svg': {
//       color: "currentColor",
//     },
//   },
// }));

// interface Props {
//   formData: CreateActivityForm;
//   updateFoodOption: (index: number, value: number) => void;
//   removeFoodOption: (index: number) => void;
//   addFoodOption: () => void;
// }

// const FoodMenuSection: React.FC<Props> = ({
//   formData,
//   updateFoodOption,
//   removeFoodOption,
//   addFoodOption,
// }) => {
//   const foods = useFoodStore((state) => state.foods);
//   const fetchFoods = useFoodStore((state) => state.fetchFoods);
//   const foodLoading = useFoodStore((state) => state.foodLoading);
//   const foodError = useFoodStore((state) => state.foodError);

//   // ✅ Load foods เมื่อ component mount
//   useEffect(() => {
//     console.log("formData: ", formData.event_format);
//     console.log("foods.lenght:", foods.length);
//     console.log("📌 selectedFoods =", formData.selectedFoods)
//     // ตรงนี้เป็น Onsite แล้ว
    
//     if (formData.event_format == "Onsite") {
//       fetchFoods();
//       console.log("fetchFood");
      
//     }
//   }, [formData.event_format]);

//   // ✅ เพิ่ม input ถ้าไม่มี selectedFoods ตอนแรก
//   // useEffect(() => {
//   //   if (
//   //     formData.event_format === "Onsite" &&
//   //     formData.selectedFoods.length === 0
//   //   ) {
//   //     addFoodOption();
//   //   }
//   // }, [formData.event_format]);

// //   useEffect(() => {
    
// //   if (
// //     formData.event_format === "Onsite" &&
// //     formData.selectedFoods.length === 0
// //   ) {
// //     console.log("🔥 adding food input");
// //     addFoodOption();
// //   }
// // }, [formData.event_format]);

// useEffect(() => {
//   if (
//     formData.event_format === "Onsite" &&
//     foods.length > 0 &&
//     formData.selectedFoods.length === 0
//   ) {
//     console.log("🔥 adding food input");
//     addFoodOption();
//   }
// }, [formData.event_format, foods, formData.selectedFoods]);



//   // if (formData.event_format !== "Onsite") {
//   //   return null;
//   // }

  

//   return (
//     <Paper className="w-140 mt-5 p-6 bg-white border border-gray-300 rounded-lg shadow-sm">
//       <Typography variant="h6" className="font-semibold mb-2">
//         อาหาร * {formData.event_format}
//       </Typography>

//       {foodLoading && <Typography>กำลังโหลดข้อมูลอาหาร...</Typography>}
//       {foodError && <Typography color="error">{foodError}</Typography>}

//       <Box className="space-y-3">
//         {formData.selectedFoods.map((foodId, index) => {
//           const shouldRenderSection = formData.event_format === "Onsite";
//           const {
//             getRootProps,
//             getInputProps,
//             getListboxProps,
//             getOptionProps,
//             groupedOptions,
//             focused,
//             setAnchorEl,
//           } = useAutocomplete({
//             id: `food-select-${index}`,
//             multiple: false,
//             options: foods,
//             value: foods.find((f) => f.food_id === foodId) ?? null,
//             getOptionLabel: (option) => option.food_name,
//             isOptionEqualToValue: (opt, val) => opt.food_id === val.food_id,
//             onChange: (_, newValue) => {
//               updateFoodOption(index, newValue?.food_id ?? 0);
//             },
//           });

//           if (!shouldRenderSection) return null;

//           return (
//             <Box key={index} className="relative space-y-1">
//               <Label className="mb-1">เลือกอาหาร</Label>
//               <Root {...getRootProps()}>
//                 <InputWrapper ref={setAnchorEl} className={focused ? "focused" : ""}>
//                   <input {...getInputProps()} />
//                 </InputWrapper>
//                 {groupedOptions.length > 0 && (
//                   <Listbox {...getListboxProps()}>
//                     {groupedOptions.map((option, idx) => (
//                       <li {...getOptionProps({ option, index: idx })} key={option.food_id}>
//                         <span>{option.food_name}</span>
//                         <CheckIcon fontSize="small" />
//                       </li>
//                     ))}
//                   </Listbox>
//                 )}
//               </Root>

//               <IconButton
//                 onClick={() => removeFoodOption(index)}
//                 color="error"
//                 size="small"
//                 sx={{ position: "absolute", top: 0, right: 0 }}
//               >
//                 <Delete />
//               </IconButton>
//             </Box>
//           );
//         })}
//       </Box>
//     </Paper>
//   );
// };

// export default FoodMenuSection;

import {
  Box,
  Paper,
  Typography,
} from "@mui/material";
import { CreateActivityForm } from "../create_activity_admin";
import { useFoodStore } from "../../../../../stores/Teacher/food.store.teacher";
import React, { useEffect, useRef } from "react";
import FoodDropdownInput from "./FoodDropdownInput"; // ✅ ย้าย Autocomplete ไป component ย่อย

interface Props {
  formData: CreateActivityForm;
  updateFoodOption: (index: number, value: number) => void;
  removeFoodOption: (index: number) => void;
  addFoodOption: () => void;
}

const FoodMenuSection: React.FC<Props> = ({
  formData,
  updateFoodOption,
  removeFoodOption,
  addFoodOption,
}) => {
  const foods = useFoodStore((state) => state.foods);
  const fetchFoods = useFoodStore((state) => state.fetchFoods);
  const foodLoading = useFoodStore((state) => state.foodLoading);
  const foodError = useFoodStore((state) => state.foodError);

  useEffect(() => {
    if (formData.event_format === "Onsite" && foods.length === 0) {
      fetchFoods();
    }
  }, [formData.event_format, foods]);

  // useEffect(() => {
  //   if (
  //     formData.event_format === "Onsite" &&
  //     foods.length > 0 &&
  //     formData.selectedFoods.length === 0
  //   ) {
  //     addFoodOption();
  //   }
  // }, [formData.event_format, foods, formData.selectedFoods]);

  const hasAdded = useRef(false);

useEffect(() => {
  if (
    formData.event_format === "Onsite" &&
    foods.length > 0 &&
    formData.selectedFoods.length === 0 &&
    !hasAdded.current
  ) {
    hasAdded.current = true;
    addFoodOption();
  }
}, [formData.event_format, foods, formData.selectedFoods]);

useEffect(() => {
  localStorage.setItem("selectedFoods", JSON.stringify(formData.selectedFoods));
}, [formData.selectedFoods]);



  if (formData.event_format !== "Onsite") return null;

  return (
    <Paper className="w-140 mt-5 p-6 bg-white border border-gray-300 rounded-lg shadow-sm">
      <Typography variant="h6" className="font-semibold mb-2">
        อาหาร *
      </Typography>

      {foodLoading && <Typography>กำลังโหลดข้อมูลอาหาร...</Typography>}
      {foodError && <Typography color="error">{foodError}</Typography>}

      <Box className="space-y-3">
        {formData.selectedFoods.map((foodId, index) => (
          <FoodDropdownInput
            key={index}
            index={index}
            foodId={foodId}
            foods={foods}
            updateFoodOption={updateFoodOption}
            removeFoodOption={removeFoodOption}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default FoodMenuSection;
