import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("AHPackModule", (m) => {
  const AHPack = m.contract("AHPack", ['ipfs://bafkreigbbkiujfq5abuj5o32tuaovla7qve2r3jdpr7vwthyiui4abbjru', 5n]);

  return { AHPack };
});
