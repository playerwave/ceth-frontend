import React from 'react';
import { Building2, ChevronDown } from 'lucide-react';

interface Props {
    floors: number[];
    floorFilter: number | 'all';
    setFloorFilter: (val: number | 'all') => void;
}

const FloorDropdown: React.FC<Props> = ({ floors, floorFilter, setFloorFilter }) => {
    const [showDropdown, setShowDropdown] = React.useState(false);

    React.useEffect(() => {
        const handleClickOutside = () => setShowDropdown(false);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-xl hover:bg-blue-900"
            >
                <span>ชั้น: {floorFilter === 'all' ? ' ' : floorFilter}</span>
                <Building2 size={18} />
                <ChevronDown size={18} />
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-300 rounded shadow-md z-50">
                    <button
                        onClick={() => {
                            setFloorFilter('all');
                            setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                        ทั้งหมด
                    </button>
                    {floors.map((floor) => (
                        <button
                            key={floor}
                            onClick={() => {
                                setFloorFilter(floor);
                                setShowDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                            ชั้น {floor}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FloorDropdown;
