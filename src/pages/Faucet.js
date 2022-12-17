import React, { useState } from 'react';
import Web3 from 'web3';

const Faucet = () => {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      // Connect to the Ethereum network
      const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

      // Get the contract instance
      const contract = new web3.eth.Contract(
        [...], // Replace with the contract ABI
        '0x...', // Replace with the contract address
      );

      // Call the contract's "transfer" function to send tokens to the specified address
      await contract.methods.transfer(address, amount).send({ from: web3.eth.defaultAccount });

      setSuccess(true);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="address">Address:</label>
      <input
        type="text"
        id="address"
        value={address}
        onChange={(event) => setAddress(event.target.value)}
      />
      <br />
      <label htmlFor="amount">Amount:</label>
      <input
        type="number"
        id="amount"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
      />
      <br />
      <button type="submit" disabled={loading}>
        Send tokens
      </button>
      {loading && <p>Loading...</p>}
      {success && <p>Tokens sent successfully</p>}
      {error && <p>Error: {error.message}</p>}
    </form>
  );
};

export default Faucet;
