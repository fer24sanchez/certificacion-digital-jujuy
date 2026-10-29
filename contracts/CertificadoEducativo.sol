// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/// @title CertificadoEducativo
/// @notice Credenciales académicas NFT no transferibles, emitidas por instituciones autorizadas.
contract CertificadoEducativo is ERC721URIStorage, AccessControl {
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    struct Certificate {
        string recipientName;
        string program;
        string documentHash;
        uint64 issuedAt;
        bool revoked;
    }

    uint256 private _nextTokenId = 1;
    mapping(uint256 => Certificate) private _certificates;

    event CertificateIssued(
        uint256 indexed tokenId,
        address indexed recipient,
        string documentHash,
        string program
    );
    event CertificateRevoked(uint256 indexed tokenId, string reason);

    constructor(address administrator) ERC721("Certificado Educativo Jujuy", "CEJ") {
        _grantRole(DEFAULT_ADMIN_ROLE, administrator);
        _grantRole(ISSUER_ROLE, administrator);
    }

    function issueCertificate(
        address recipient,
        string calldata recipientName,
        string calldata program,
        string calldata documentHash,
        string calldata metadataUri
    ) external onlyRole(ISSUER_ROLE) returns (uint256 tokenId) {
        require(recipient != address(0), "Destinatario invalido");
        require(bytes(documentHash).length > 0, "Hash requerido");

        tokenId = _nextTokenId++;
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, metadataUri);
        _certificates[tokenId] = Certificate({
            recipientName: recipientName,
            program: program,
            documentHash: documentHash,
            issuedAt: uint64(block.timestamp),
            revoked: false
        });

        emit CertificateIssued(tokenId, recipient, documentHash, program);
    }

    function revokeCertificate(uint256 tokenId, string calldata reason)
        external
        onlyRole(ISSUER_ROLE)
    {
        _requireOwned(tokenId);
        require(!_certificates[tokenId].revoked, "Ya revocado");
        _certificates[tokenId].revoked = true;
        emit CertificateRevoked(tokenId, reason);
    }

    function getCertificate(uint256 tokenId)
        external
        view
        returns (Certificate memory certificate, address recipient, string memory metadataUri)
    {
        recipient = ownerOf(tokenId);
        return (_certificates[tokenId], recipient, tokenURI(tokenId));
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /// @dev Los certificados no se pueden transferir: la identidad del titular permanece vinculada.
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        require(from == address(0) || to == address(0), "Certificado no transferible");
        return super._update(to, tokenId, auth);
    }
}
