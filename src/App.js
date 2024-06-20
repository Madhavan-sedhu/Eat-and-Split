import { useState } from "react";
import "./App.css";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function App() {
  const [friends, setFriend] = useState(initialFriends);
  const [show, setShow] = useState(false);
  const [selectFriend, setSelectFriend] = useState(null);

  function handleAddButton() {
    setShow((show) => !show);
  }

  function addNewFriend(friend) {
    setFriend((curr) => [...curr, friend]);
  }

  function handleSelectFriend(friend) {
    setSelectFriend((curr) => (curr?.id === friend.id ? null : friend));
  }

  function handleSplitBill(value) {
    setFriend((friends) =>
      friends.map((friend) =>
        selectFriend.id === friend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onSelectFriend={handleSelectFriend}
          selectFriend={selectFriend}
        />
        ;
        {show && (
          <Form handleAddButton={handleAddButton} addNewFriend={addNewFriend} />
        )}
        <Button onClick={handleAddButton}>
          {show ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectFriend && (
        <SplitBill selectFriend={selectFriend} onSplit={handleSplitBill} />
      )}
    </div>
  );
}

function FriendList({ friends, onSelectFriend, selectFriend }) {
  return (
    <ul>
      {friends.map((items) => (
        <List
          items={items}
          key={items.id}
          onSelectFriend={onSelectFriend}
          selectFriend={selectFriend}
        />
      ))}
    </ul>
  );
}

function List({ items, onSelectFriend, selectFriend }) {
  const isSelected = selectFriend?.id === items.id;
  return (
    <li>
      <img src={items.image} />

      <h3>{items.name}</h3>

      {items.balance < 0 && (
        <p className={items.balance < 0 ? "red" : "green"}>
          You owe {items.name} {items.balance}$
        </p>
      )}

      {items.balance == 0 && <p>You and {items.name} are even</p>}

      {items.balance > 0 && (
        <p className={items.balance < 0 ? "red" : "green"}>
          {items.name} owe You {items.balance}$
        </p>
      )}
      <Button onClick={() => onSelectFriend(items)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Form({ addNewFriend }) {
  const [name, setName] = useState();
  const [image, setImage] = useState("https://i.pravatar.cc/48?u=499476");

  function handleSubmitButton(e) {
    e.preventDefault();

    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = { id, name, image: `${image}?=${id}`, balance: 0 };
    addNewFriend(newFriend);
    setName("");
    setImage("");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmitButton}>
      <label>👫Friend Name</label>
      <input value={name} onChange={(e) => setName(e.target.value)} />

      <label>👫 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function SplitBill({ selectFriend, onSplit }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : " ";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSplitForm(e) {
    e.preventDefault();

    onSplit(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSplitForm}>
      <h2>Split a bill with {selectFriend.name}</h2>

      <label>💰Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🧍‍♂️Your Expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      <label>👫{selectFriend.name} Expense</label>
      <input type="text" disabled value={paidByFriend} />

      <label>🤑Who is paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
export default App;
