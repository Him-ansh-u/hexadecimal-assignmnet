import { useState } from "react";
import Axios from "axios";
import debounce from "./debounc";
import { CiSearch } from "react-icons/ci";
function App() {
  const [data, setData] = useState();
  const [token, setToken] = useState();
  const [user, setUser] = useState();

  const updateDebounce = debounce((text) => {
    getData(token, text);
  });

  const handleChange = (e) => {
    updateDebounce(e.target.value);
  };
  const getData = async (token, searchText) => {
    console.log(searchText);
    await Axios.get(`http://localhost:3000/`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        searchText: searchText,
      },
    }).then((res) => {
      setData(res.data);
    });
  };
  const login = async (e) => {
    e.preventDefault();
    const userData = {
      username: e.target.username.value,
      password: e.target.password.value,
    };
    Axios.post("http://localhost:3000/login", userData).then((res) => {
      setToken(res.data.token);
      setUser(res.data.user);
      getData(res.data.token);
    });
  };

  return (
    <div>
      {data ? (
        <div>
          <div className='searchBar'>
            <div className='search'>
              <CiSearch size='20px' />
              <input
                type='text'
                placeholder='Search...'
                onChange={handleChange}
              />
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th rowSpan={2}>Name</th>
                <th rowSpan={2}>Username</th>
                <th rowSpan={2}>Emai</th>
                <th colSpan={4}>Address</th>
                <th rowSpan={2}>Phone</th>
                <th rowSpan={2}>Website</th>
                <th colSpan={3}>Company</th>
              </tr>
              <tr>
                <th>Street</th>
                <th>Suite</th>
                <th>City</th>
                <th>Zipcode</th>
                <th>Name</th>
                <th>Catch Phrase</th>
                <th>BS</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, key) => {
                return <TableData data={item} key={key} />;
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className='homeText' onSubmit={login}>
          <form>
            <input type='text' placeholder='Username' name='username' />
            <input type='password' placeholder='password' name='password' />
            <input type='submit' value='Login' />
          </form>
        </div>
      )}
    </div>
  );
}

const TableData = (props) => {
  return (
    <tr className='tableRow'>
      <td>{props.data.name}</td>
      <td>{props.data.username}</td>
      <td>{props.data.email}</td>
      <td>{props.data.address.street}</td>
      <td>{props.data.address.suite}</td>
      <td>{props.data.address.city}</td>
      <td>{props.data.address.zipcode}</td>
      <td>{props.data.phone}</td>
      <td>{props.data.website}</td>
      <td>{props.data.company.name}</td>
      <td>{props.data.company.catchPhrase}</td>
      <td>{props.data.company.bs}</td>
    </tr>
  );
};

export default App;
