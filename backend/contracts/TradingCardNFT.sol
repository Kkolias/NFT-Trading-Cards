// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TradingCardNFT is ERC1155, Ownable {
    string public collectionName;
    struct Card {
        string cardId;
        uint256 id;
        string name;
        string description;
        string imageURI;
        uint256 maxSupply;
        uint256 currentSupply;
        string rarity;
    }

    uint256 public nextTokenId = 1;
    mapping(uint256 => Card) public cards;
    mapping(string => uint256[]) public rarityToCardIds;
    mapping(address => uint256[]) public userOwnedTokens;
    string[] public existingCardIds;

    address public paymentReceiver = 0xdD2FD4581271e230360230F9337D5c0430Bf44C0;
    uint256 public packPrice = 0.01 ether;

    event SingleCardMinted(address indexed account, uint256 tokenId);
    event PackOpened(address indexed account, uint256[] tokenIds);
    event Debug(uint256 value);

    constructor(
        string memory _collectionName
    ) ERC1155("https://gateway.pinata.cloud/ipfs/") Ownable(msg.sender) {
        collectionName = _collectionName;
    }

    function registerCard(
        string memory _cardId,
        string memory _name,
        string memory _description,
        string memory _imageURI,
        uint256 _maxSupply
    ) public {
        require(_maxSupply > 0, "Max supply must be greater than 0");
        require(bytes(_cardId).length > 0, "Card ID is required");
        require(bytes(_name).length > 0, "Name is required");
        require(bytes(_description).length > 0, "Description is required");
        require(bytes(_imageURI).length > 0, "Image URI is required");

        bool cardAlreadyExists = false;
        for (uint256 i = 0; i < existingCardIds.length; i++) {
            if (
                keccak256(abi.encodePacked(existingCardIds[i])) ==
                keccak256(abi.encodePacked(_cardId))
            ) {
                cardAlreadyExists = true;
                break;
            }
        }
        require(!cardAlreadyExists, "Card with this ID already exists");

        string memory _rarity = getRarity(_maxSupply);
        cards[nextTokenId] = Card({
            cardId: _cardId,
            id: nextTokenId,
            name: _name,
            description: _description,
            imageURI: _imageURI,
            maxSupply: _maxSupply,
            currentSupply: 0,
            rarity: _rarity
        });
        existingCardIds.push(_cardId);

        rarityToCardIds[_rarity].push(nextTokenId);
        nextTokenId++;
    }

    // v1 tehään vaa avaus jossa otetaan randomilla kortin id ja annetaan se käyttäjälle
    function openPack(address recipient) public {
        uint256 maxCardId = nextTokenId - 1;
        uint256 cardId = getRandomNumber(1, maxCardId, 1);
        require(
            cards[cardId].currentSupply < cards[cardId].maxSupply,
            "Card is sold out"
        );
        cards[cardId].currentSupply++;
        _mint(recipient, cardId, 1, "");
        userOwnedTokens[recipient].push(cardId);

        emit SingleCardMinted(recipient, cardId);
    }

    // v2 tehdään avaus jossa pelaaja saa 5 korttia
    // lasketaan mahdollisuudet olemassa oleville korteille maxSupplyn perusteella, ei huomoida täysin myytyjä
    // jos esim kortilla 1 on maxSupply 100 ja kortilla 2 on maxSupply 10, niin kortti 1 on 10 kertaa todennäköisempi kuin kortti 2
    function openPackV2() public payable {
        require(msg.value == packPrice, "Incorrect payment amount");
        address recipient = msg.sender;

        uint256 cardsInPack = 5; // Avattavat kortit
        uint256 cardId;
        string memory rarity;
        // avatut kortit
        uint256[] memory openedCards = new uint256[](cardsInPack);

        for (uint256 i = 0; i < cardsInPack; i++) {
            rarity = getRandomRarity(i);

            // Arvotaan kortti halutun rarity-luokan sisällä
            cardId = getCardByRarity(rarity, i);

            require(
                cards[cardId].currentSupply < cards[cardId].maxSupply,
                "Card is sold out"
            );

            cards[cardId].currentSupply++;
            _mint(recipient, cardId, 1, "");
            userOwnedTokens[recipient].push(cardId);

            openedCards[i] = cardId;

            emit SingleCardMinted(recipient, cardId);
        }

        (bool success, ) = paymentReceiver.call{value: msg.value}("");
        require(success, "Payment transfer failed");

        emit PackOpened(recipient, openedCards);
    }

    function getRandomNumber(
        uint256 min,
        uint256 max,
        uint256 nonce
    ) public view returns (uint256) {
        require(min <= max, "Min should be less than max");
        if (min == max) {
            return min;
        }

        // Käytetään noncea (loopin indeksinä) parantamaan satunnaisuutta
        uint256 randomHash = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    msg.sender,
                    nonce
                )
            )
        ) % (max - min + 1);

        return randomHash + min;
    }

    function getCardByRarity(
        string memory rarity,
        uint256 nonce
    ) private view returns (uint256) {
        uint256[] storage availableCardIds = rarityToCardIds[rarity];
        uint256 count = availableCardIds.length;

        require(count > 0, "No cards available for this rarity");

        // Arvotaan satunnainen kortti valitusta rarity-luokasta
        uint256 randomIndex = getRandomNumber(0, count - 1, nonce);
        return availableCardIds[randomIndex];
    }

    function getRandomRarity(
        uint256 nonce
    ) private view returns (string memory) {
        uint256 random = getRandomNumber(1, 100, nonce);

        // Arvotaan rarity-todennäköisyyksien perusteella
        if (random <= 1) {
            return "Legendary"; // 1%
        } else if (random <= 6) {
            return "Epic"; // 5%
        } else if (random <= 31) {
            return "Rare"; // 25%
        } else {
            return "Common"; // 69%
        }
    }

    function getRarity(uint256 maxSupply) private pure returns (string memory) {
        if (maxSupply > 100) {
            return "Common";
        } else if (maxSupply > 10) {
            return "Rare";
        } else if (maxSupply > 1) {
            return "Epic";
        } else {
            return "Legendary";
        }
    }

    function getCardIdsByRarity(
        string memory rarity
    ) public view returns (uint256[] memory) {
        return rarityToCardIds[rarity];
    }

    function getCard(
        uint256 tokenId
    )
        public
        view
        returns (
            string memory name,
            string memory description,
            string memory imageURI,
            uint256 maxSupply,
            uint256 currentSupply,
            string memory rarity
        )
    {
        Card memory card = cards[tokenId];
        return (
            card.name,
            card.description,
            card.imageURI,
            card.maxSupply,
            card.currentSupply,
            getRarity(card.maxSupply)
        );
    }

    function getMyCardIds() public view returns (uint256[] memory) {
        address account = msg.sender;
        return userOwnedTokens[account];
    }

    function getCardIdsOfAddress(
        address account
    ) public view returns (uint256[] memory) {
        return userOwnedTokens[account];
    }

    function getCards() public view returns (Card[] memory) {
        Card[] memory _cards = new Card[](nextTokenId - 1);
        for (uint256 i = 1; i < nextTokenId; i++) {
            _cards[i - 1] = cards[i];
        }
        return _cards;
    }

    function getRarityToCardsByKey(
        string memory rarity
    ) public view returns (uint256[] memory) {
        return rarityToCardIds[rarity];
    }
}
