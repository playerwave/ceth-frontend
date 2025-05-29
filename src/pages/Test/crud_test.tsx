import { useUserStore } from "../../stores/Test/store_test";
import { useState, useEffect } from "react";
import Loading from "../../components/Loading";

const crud_test = () => {
  const {
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    users,
    isLoading,
    error,
  } = useUserStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (editingUser) {
      await updateUser({ id: editingUser, firstName, lastName, age });
      setEditingUser(null);
    } else {
      await createUser({ id: Date.now().toString(), firstName, lastName, age });
    }

    setLoading(false);
    setFirstName("");
    setLastName("");
    setAge(0);
    fetchUsers();
  };

  const handleEdit = (user: any) => {
    setEditingUser(user.id);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setAge(user.age);
  };

  const handleDelete = async (userId: string) => {
    await deleteUser(userId);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div>
      {/* แสดง Loading เต็มจอ แต่ Sidebar ยังคงอยู่ */}
      {isLoading && <Loading />}

      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-xl font-semibold mb-4">
          {editingUser ? "Edit User" : "Create User"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : editingUser
              ? "Update User"
              : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
};
