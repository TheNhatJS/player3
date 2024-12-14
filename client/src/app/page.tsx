"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";

const contractAddress = "0x9F24021f3983cCA08eBa4290A02aA36CBc6aadE0";
const ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "strength",
        "type": "uint256"
      }
    ],
    "name": "addPlayer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllPlayers",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      },
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      },
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextPlayerID",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "playerIDs",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "players",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "strength",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "playerID",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "strength",
        "type": "uint256"
      }
    ],
    "name": "updatePlayer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const PlayerManager = () => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newPlayer, setNewPlayer] = useState({ name: "", strength: "" });
  const [account, setAccount] = useState<string | null>(null);

  // useEffect(() => {
  //   if (window?.ethereum) {
  //     initializeContract();
  //   } else {
  //     alert("MetaMask is not installed! Please install it to use this feature.");
  //   }
  // }, []);

  useEffect(() => {
    const checkProvider = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        initializeContract();
      } else {
        alert("MetaMask is not installed! Please install it to use this feature.");
      }
    };
  
    checkProvider();
  }, []);

  // const initializeContract = async () => {
  //   try {
  //     const provider = new ethers.BrowserProvider(window.ethereum);
  //     const signer = await provider.getSigner();
  //     const contractInstance = new ethers.Contract(contractAddress, ABI, signer);
  //     const currentAccount = await signer.getAddress();
  //     setAccount(currentAccount);

  //     const ownerAddress = await contractInstance.owner();
  //     setIsAdmin(ownerAddress.toLowerCase() === currentAccount.toLowerCase());

  //     setContract(contractInstance);
  //     fetchPlayers(contractInstance);
  //   } catch (error: any) {
  //     console.error("Failed to initialize contract:", error.message);
  //   }
  // };

  const initializeContract = async () => {
    try {
      const provider: any = await detectEthereumProvider();
  
      if (provider) {
        const ethersProvider = new ethers.BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, ABI, signer);
        const currentAccount = await signer.getAddress();
        setAccount(currentAccount);
  
        const ownerAddress = await contractInstance.owner();
        setIsAdmin(ownerAddress.toLowerCase() === currentAccount.toLowerCase());
  
        setContract(contractInstance);
        fetchPlayers(contractInstance);
      } else {
        console.error("MetaMask provider not found.");
      }
    } catch (error: any) {
      console.error("Failed to initialize contract:", error.message);
    }
  };

  const fetchPlayers = async (contractInstance: ethers.Contract) => {
    try {
      const [ids, names, strengths] = await contractInstance.getAllPlayers();
      const playersData = ids.map((id: number, index: number) => ({
        id,
        name: names[index],
        strength: strengths[index].toString()
      }));
      setPlayers(playersData);
    } catch (error: any) {
      console.error("Failed to fetch players:", error.message);
    }
  };

  const handleAddPlayer = async () => {
    if (!contract || !newPlayer.name || !newPlayer.strength) return;

    try {
      const tx = await contract.addPlayer(newPlayer.name, parseInt(newPlayer.strength));
      await tx.wait();
      setNewPlayer({ name: "", strength: "" });
      fetchPlayers(contract);
    } catch (error: any) {
      console.error("Failed to add player:", error.message);
    }
  };

  const handleUpdatePlayer = async (id: number, name: string, strength: number) => {
    if (!contract) return;

    try {
      const tx = await contract.updatePlayer(id, name, strength);
      await tx.wait();
      fetchPlayers(contract);
    } catch (error: any) {
      console.error("Failed to update player:", error.message);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Quản lý Người chơi</h1>
      <p className="mb-6">Tài khoản kết nối: {account}</p>
      
      {isAdmin && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Thêm Người chơi</h2>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Tên"
              value={newPlayer.name}
              onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
              className="p-2 border border-gray-300 rounded"
            />
            <input
              type="number"
              placeholder="Sức mạnh"
              value={newPlayer.strength}
              onChange={(e) => setNewPlayer({ ...newPlayer, strength: e.target.value })}
              className="p-2 border border-gray-300 rounded"
            />
            <button
              onClick={handleAddPlayer}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Thêm Người chơi
            </button>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4">Tất cả Người chơi</h2>
      <table className="w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Tên</th>
            <th className="px-4 py-2 text-left">Sức mạnh</th>
            {isAdmin && <th className="px-4 py-2 text-left">Hành động</th>}
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id} className="border-b">
              <td className="px-4 py-2">{player.id}</td>
              <td className="px-4 py-2">{player.name}</td>
              <td className="px-4 py-2">{player.strength}</td>
              {isAdmin && (
                <td className="px-4 py-2">
                  <button
                    onClick={() =>
                      handleUpdatePlayer(
                        player.id,
                        prompt("Tên mới:", player.name) || player.name,
                        parseInt(prompt("Sức mạnh mới:", player.strength) || player.strength)
                      )
                    }
                    className="text-yellow-600 hover:text-yellow-800"
                  >
                    Cập nhật
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default PlayerManager;
