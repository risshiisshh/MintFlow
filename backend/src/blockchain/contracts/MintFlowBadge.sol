// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MintFlowBadge
 * @dev Minimal ERC-721 credential badge contract for MintFlow gasless onboarding demo.
 *
 * Design decisions:
 *  - No external dependencies (no OpenZeppelin import) so the file can be compiled
 *    via the `solc` npm package without a complex resolver setup.
 *  - Full ERC-721 + ERC-165 implementation inline.
 *  - 1 badge per address limit — prevents infinite-mint abuse on testnet.
 *  - Public `safeMint` allows the ERC-4337 Safe smart account to mint for itself
 *    (the UserOperation calls safeMint(smartAccountAddress)).
 */
contract MintFlowBadge {
    // ── ERC-721 Storage ──────────────────────────────────────────────────────
    string public name     = "MintFlow Genesis Badge";
    string public symbol   = "MFBADGE";
    uint256 private _nextTokenId;

    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => address) private _tokenApprovals;
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    // ── Credential Guard ─────────────────────────────────────────────────────
    /// @dev Tracks which addresses have already claimed a badge (1 per address)
    mapping(address => bool) public hasMinted;

    // ── Events ───────────────────────────────────────────────────────────────
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    // ── ERC-165 ──────────────────────────────────────────────────────────────
    function supportsInterface(bytes4 interfaceId) public pure returns (bool) {
        return
            interfaceId == 0x80ac58cd || // ERC-721
            interfaceId == 0x5b5e139f || // ERC-721Metadata
            interfaceId == 0x01ffc9a7;   // ERC-165
    }

    // ── ERC-721 Read ─────────────────────────────────────────────────────────
    function balanceOf(address owner) public view returns (uint256) {
        require(owner != address(0), "ERC721: zero address");
        return _balances[owner];
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "ERC721: nonexistent token");
        return owner;
    }

    function getApproved(uint256 tokenId) public view returns (address) {
        require(_owners[tokenId] != address(0), "ERC721: nonexistent token");
        return _tokenApprovals[tokenId];
    }

    function isApprovedForAll(address owner, address operator) public view returns (bool) {
        return _operatorApprovals[owner][operator];
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(_owners[tokenId] != address(0), "ERC721: nonexistent token");
        // On-chain SVG badge metadata — no IPFS dependency needed for demo
        return string(abi.encodePacked(
            "data:application/json;utf8,",
            '{"name":"MintFlow Genesis Badge #', _toString(tokenId),
            '","description":"A gasless credential badge minted on MintFlow via ERC-4337 Account Abstraction.","image":"data:image/svg+xml;utf8,',
            '<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 200 200\\"><rect width=\\"200\\" height=\\"200\\" rx=\\"20\\" fill=\\"#1a3a2a\\"/><text x=\\"100\\" y=\\"110\\" font-size=\\"48\\" text-anchor=\\"middle\\" fill=\\"#acf67c\\">&#127919;</text><text x=\\"100\\" y=\\"155\\" font-size=\\"14\\" text-anchor=\\"middle\\" fill=\\"#a0d0a0\\">MintFlow Genesis</text></svg>',
            '","attributes":[{"trait_type":"Network","value":"Testnet"},{"trait_type":"Badge Type","value":"Genesis Credential"}]}'
        ));
    }

    // ── ERC-721 Write ────────────────────────────────────────────────────────
    function approve(address to, uint256 tokenId) public {
        address owner = ownerOf(tokenId);
        require(to != owner, "ERC721: approve to current owner");
        require(msg.sender == owner || isApprovedForAll(owner, msg.sender), "ERC721: not authorized");
        _tokenApprovals[tokenId] = to;
        emit Approval(owner, to, tokenId);
    }

    function setApprovalForAll(address operator, bool approved) public {
        require(operator != msg.sender, "ERC721: approve to caller");
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function transferFrom(address from, address to, uint256 tokenId) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "ERC721: not authorized");
        _transfer(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public {
        transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory) public {
        transferFrom(from, to, tokenId);
    }

    // ── Credential Mint ──────────────────────────────────────────────────────
    /**
     * @notice Mints one genesis badge to `to`. Reverts if `to` has already minted.
     * @dev Called by the ERC-4337 UserOperation via the Safe Smart Account.
     *      No access control — the 1-per-address cap is the security mechanism.
     * @param to The recipient address (should be the caller's smart account address).
     */
    function safeMint(address to) public {
        require(to != address(0), "MintFlowBadge: zero address");
        require(!hasMinted[to], "MintFlowBadge: already minted");

        hasMinted[to] = true;
        uint256 tokenId = _nextTokenId++;
        _owners[tokenId] = to;
        _balances[to] += 1;

        emit Transfer(address(0), to, tokenId);
    }

    /// @notice Returns the total number of badges minted so far.
    function totalSupply() public view returns (uint256) {
        return _nextTokenId;
    }

    // ── Internal Helpers ─────────────────────────────────────────────────────
    function _transfer(address from, address to, uint256 tokenId) internal {
        require(ownerOf(tokenId) == from, "ERC721: wrong owner");
        require(to != address(0), "ERC721: zero address");

        delete _tokenApprovals[tokenId];
        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
        address owner = ownerOf(tokenId);
        return (spender == owner || getApproved(tokenId) == spender || isApprovedForAll(owner, spender));
    }

    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) { digits++; temp /= 10; }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits--;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
