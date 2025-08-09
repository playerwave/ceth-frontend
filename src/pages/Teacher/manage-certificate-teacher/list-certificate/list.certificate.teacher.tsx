import React, { useState } from 'react';
import Certificate from "./component/certificatetable";
import Searchbar from "./component/Searchbar";



const listCertificateTeacher = () => {

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="max-w-screen-xl w-full mx-auto px-6 mt-5">
      <h1 className="text-center text-2xl font-bold mb-4">จัดการเกียรติบัตร</h1>

      <div className="flex justify-center items-center w-full mt-10 mb-29">
        <Searchbar onSearch={(term) => setSearchTerm(term)} />
      </div>


      <div className="bg-white p-6 shadow-2xl rounded-lg my-10 overflow-x-auto">
        <h2 className="text-left font-semibold text-black mb-4">
          นิสิตที่เครมเกียรติบัตร
        </h2>

        <div style={{ height: 400 }}>
          <Certificate />

        </div>
      </div>
    </div>



  );
};

export default listCertificateTeacher;
