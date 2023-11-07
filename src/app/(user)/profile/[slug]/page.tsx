
import { sendRequest } from "@/utils/api";
import ProfileApp from "@/components/Header/app.profile";
const ProfilePage = async ({ params }: { params: { slug: string } }) => {

  const idUser = params.slug;
  const res = await sendRequest({
    url: "http://localhost:8000/api/v1/tracks/users",
    method: "POST",
    body: { id: idUser },
    queryParams:{
      current:1,
      pageSize:100
    },
    nextOption: { next: { tags: ["profile-by-user"] } },

    
  });
  // console.log(res?.data?.result,'check ress user')
  //@ts-ignore
  const dataUser = res?.data?.result ?? [];
  return (
    <div>
      <ProfileApp dataUser={dataUser}></ProfileApp>
    </div>
  );
};
export default ProfilePage;
