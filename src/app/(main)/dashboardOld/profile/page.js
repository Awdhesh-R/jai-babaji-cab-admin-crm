import UserInfoCard from '@/components/user-profile/UserInfoCard';

export const metadata = {
  title: "Customer Profile | RodBez - Revolution is on the way",
  description: "This is Customer Profile Page",
};

export default function Profile() {
  return (
    <div>
      <UserInfoCard />
    </div>
  );
}