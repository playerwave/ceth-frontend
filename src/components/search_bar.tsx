import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const search_bar: React.FC = () => {
  return (
    <div className="relative bg-white shadow p-3 rounded-lg mb-4 max-w-4xl mx-auto">
      <input
        type="text"
        placeholder="Search..."
        className="w-full pl-10 border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <FontAwesomeIcon
        icon={faSearch}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 text-2xl"
        style={{ color: "#1E3A8A" }}
      />
    </div>
  );
};

export default search_bar;
