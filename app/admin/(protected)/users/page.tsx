import CreateUserForm from "./CreateUserForm";

export default function UsersManagementPage() {
  return (
    <div className="p-8">
       <h1 className="text-3xl font-bold mb-8 text-blue-900">จัดการพนักงาน</h1>
       <CreateUserForm />
    </div>
  );
}
