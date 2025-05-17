import { useAuthStore } from "../stores/auth.store";

const UserProfile = () => {
  const { user } = useAuthStore();

  return (
    <div className="flex items-center gap-4 text-white">
      <div className="leading-tight">
        <p className="font-semibold text-base">{user?.u_fullname}</p>
        <p className="text-sm capitalize">{user?.u_role}</p>
      </div>
    </div>
  );
};

export default UserProfile;
