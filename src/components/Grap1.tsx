import { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

// GraphQL Queries
const GETUSERS = gql`
  {
    users {
      id
      firstName
      lastName
      age
    }
  }
`;

const ADDUSER = gql`
  mutation AddUser($firstName: String!, $lastName: String!, $age: Int!) {
    addUser(firstName: $firstName, lastName: $lastName, age: $age) {
      id
      firstName
      lastName
      age
    }
  }
`;

const DELETEUSER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
      firstName
    }
  }
`;

const EDITUSER = gql`
  mutation EditUser($id: ID!, $firstName: String, $lastName: String, $age: Int) {
    editUser(id: $id, firstName: $firstName, lastName: $lastName, age: $age) {
      id
      firstName
      lastName
      age
    }
  }
`;

const Grap1 = () => {
  const { loading, error, data, refetch } = useQuery(GETUSERS);
  const [addUser] = useMutation(ADDUSER);
  const [deleteUser] = useMutation(DELETEUSER);
  const [editUser] = useMutation(EDITUSER);

  const [form, setForm] = useState({ firstName: "", lastName: "", age: "" });
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ firstName: "", lastName: "", age: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [isnotEditing, setIsNotEditing] = useState(true);

  const handleAdd = async (e: any) => {
    e.preventDefault();
    await addUser({
      variables: {
        firstName: form.firstName,
        lastName: form.lastName,
        age: parseInt(form.age),
      },
    });
    setForm({ firstName: "", lastName: "", age: "" });
    refetch();
  };

  const handleDelete = async (id: string) => {
    await deleteUser({ variables: { id } });
    refetch();
  };

  const handleEdit = (id: string) => {
    setIsNotEditing(false);
    const user = data.users.find((u: any) => u.id === id);
    if (user) {
      setEditUserId(id);
      setEditForm({
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age.toString(),
      });
      setIsEditing(true);
    }
  };

  const handleSave = async (e: any) => {
    setIsNotEditing(true);
    e.preventDefault();
    if (!editUserId) {
      alert("No user selected for editing.");
      return;
    }

    await editUser({
      variables: {
        id: editUserId,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        age: parseInt(editForm.age),
      },
    });

    setIsEditing(false);
    setEditUserId(null);
    setEditForm({ firstName: "", lastName: "", age: "" });
    refetch();
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading users...</p>;
  }
  if (error) {
    return <p className="text-center text-red-500">Error: {error.message}</p>;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold mb-6 text-white">User Todo List</h2>

      {/* User List */}
      <ul className="w-full max-w-md space-y-3">
        {data?.users.map((u: any) => (
          <li key={u.id} className="flex items-center justify-between bg-white shadow rounded-xl p-4">
            <div>
              <p className="font-semibold">
                {u.firstName} {u.lastName}
              </p>
              <p className="text-sm text-gray-500">Age: {u.age}</p>
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(u.id)} className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600">
                Edit
              </button>
              <button onClick={() => handleDelete(u.id)} className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Add Form */}
      {isnotEditing && (
        <div className="w-full max-w-md mt-8 bg-white shadow-md rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Add New User</h3>
          <form onSubmit={handleAdd} className="space-y-3">
            <input type="text" placeholder="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"/>
            <input type="text" placeholder="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"/>
            <input type="number" placeholder="Age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"/>
            <button type="submit" className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              Add User
            </button>
          </form>
        </div>
      )}

      {/* Edit Form */}
      {isEditing && (
        <div className="w-full max-w-md mt-8 bg-white shadow-md rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Edit User</h3>
          <form onSubmit={handleSave} className="space-y-3">
            <input type="text" placeholder="First Name" value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"/>
            <input type="text" placeholder="Last Name" value={editForm.lastName} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"/>
            <input type="number" placeholder="Age" value={editForm.age} onChange={(e) => setEditForm({ ...editForm, age: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"/>
            <div className="flex justify-between">
              <button type="button" onClick={() => { setIsEditing(false); setIsNotEditing(true); }} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Grap1;
