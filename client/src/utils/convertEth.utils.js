import { ethers } from 'ethers';

export const weiToEth = (wei) => {
  try {
    return ethers.utils.formatEther(wei);
  } catch (error) {
    console.error('Error converting wei to ether:', error);
    return '0';
  }
};

export const ethToWei = (eth) => {
  try {
    return ethers.utils.parseEther(eth);
  } catch (error) {
    console.error('Error converting ether to wei:', error);
    return '0';
  }
};
