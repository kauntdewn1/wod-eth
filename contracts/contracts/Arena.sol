// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ValidatorRegistry.sol";

/**
 * @title Arena
 * @dev Contrato principal da Arena - Mineração de $WOD através de desempenho validado
 */
contract Arena is Ownable, ReentrancyGuard {
    IERC20 public wodToken;
    ValidatorRegistry public validatorRegistry;

    struct Challenge {
        uint256 id;
        string name;
        string description;
        uint256 entryFee; // Taxa de entrada em $WOD
        uint256 prizePool; // Pool de prêmios acumulado
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        mapping(address => Submission) submissions;
        address[] participants;
    }

    struct Submission {
        address athlete;
        string proofCID; // CID do Lighthouse/IPFS
        uint256 timestamp;
        bool exists;
    }

    struct Vote {
        address validator;
        address athlete;
        bool approved; // true = Rep, false = No-Rep
        uint256 timestamp;
    }

    mapping(uint256 => Challenge) public challenges;
    mapping(bytes32 => Vote) public votes; // keccak256(challengeId, validator, athlete) => vote
    mapping(uint256 => address[]) public challengeWinners; // challengeId => winners

    uint256 public challengeCount;
    uint256 public constant VALIDATION_DEADLINE = 7 days;
    uint256 public constant MIN_CONSENSUS_PERCENT = 51; // 51% dos validadores devem aprovar

    event ChallengeCreated(
        uint256 indexed challengeId,
        string name,
        uint256 entryFee,
        uint256 startTime,
        uint256 endTime
    );

    event ChallengeEntered(
        uint256 indexed challengeId,
        address indexed athlete,
        uint256 entryFee
    );

    event SubmissionSubmitted(
        uint256 indexed challengeId,
        address indexed athlete,
        string proofCID
    );

    event VoteCast(
        uint256 indexed challengeId,
        address indexed validator,
        address indexed athlete,
        bool approved
    );

    event ChallengeResolved(
        uint256 indexed challengeId,
        address[] winners,
        uint256 totalPrizePool
    );

    constructor(
        address _wodToken,
        address _validatorRegistry,
        address initialOwner
    ) Ownable(initialOwner) {
        wodToken = IERC20(_wodToken);
        validatorRegistry = ValidatorRegistry(_validatorRegistry);
    }

    /**
     * @dev Cria um novo desafio na Arena
     */
    function createChallenge(
        string memory name,
        string memory description,
        uint256 entryFee,
        uint256 startTime,
        uint256 endTime
    ) external onlyOwner returns (uint256) {
        require(entryFee > 0, "Entry fee must be greater than 0");
        require(endTime > startTime, "Invalid time range");

        challengeCount++;
        uint256 challengeId = challengeCount;

        Challenge storage challenge = challenges[challengeId];
        challenge.id = challengeId;
        challenge.name = name;
        challenge.description = description;
        challenge.entryFee = entryFee;
        challenge.startTime = startTime;
        challenge.endTime = endTime;
        challenge.isActive = true;

        emit ChallengeCreated(challengeId, name, entryFee, startTime, endTime);
        return challengeId;
    }

    /**
     * @dev Atleta entra em um desafio pagando a taxa de entrada
     */
    function enterChallenge(uint256 challengeId) external nonReentrant {
        Challenge storage challenge = challenges[challengeId];
        require(challenge.isActive, "Challenge is not active");
        require(block.timestamp >= challenge.startTime, "Challenge not started");
        require(block.timestamp <= challenge.endTime, "Challenge ended");
        require(
            !challenge.submissions[msg.sender].exists,
            "Already entered this challenge"
        );

        // Transferir taxa de entrada para o contrato (acumula no prize pool)
        require(
            wodToken.transferFrom(msg.sender, address(this), challenge.entryFee),
            "Transfer failed"
        );

        challenge.prizePool += challenge.entryFee;
        challenge.participants.push(msg.sender);

        emit ChallengeEntered(challengeId, msg.sender, challenge.entryFee);
    }

    /**
     * @dev Atleta submete prova de esforço (CID do Lighthouse/IPFS)
     */
    function submitProof(
        uint256 challengeId,
        string memory proofCID
    ) external {
        Challenge storage challenge = challenges[challengeId];
        require(challenge.isActive, "Challenge is not active");
        require(block.timestamp <= challenge.endTime, "Challenge ended");
        require(
            challenge.submissions[msg.sender].exists ||
                _hasEntered(challenge, msg.sender),
            "Must enter challenge first"
        );

        Submission storage submission = challenge.submissions[msg.sender];
        submission.athlete = msg.sender;
        submission.proofCID = proofCID;
        submission.timestamp = block.timestamp;
        submission.exists = true;

        emit SubmissionSubmitted(challengeId, msg.sender, proofCID);
    }

    /**
     * @dev Validador vota em uma submissão (Rep/No-Rep)
     */
    function vote(
        uint256 challengeId,
        address athlete,
        bool approved
    ) external {
        Challenge storage challenge = challenges[challengeId];
        require(challenge.isActive, "Challenge is not active");
        require(
            block.timestamp <= challenge.endTime + VALIDATION_DEADLINE,
            "Validation deadline passed"
        );
        require(
            challenge.submissions[athlete].exists,
            "Submission does not exist"
        );
        require(
            validatorRegistry.isValidator(msg.sender),
            "Not a validator"
        );
        
        bytes32 voteKey = keccak256(abi.encodePacked(challengeId, msg.sender, athlete));
        require(
            votes[voteKey].timestamp == 0,
            "Already voted for this athlete"
        );

        votes[voteKey] = Vote({
            validator: msg.sender,
            athlete: athlete,
            approved: approved,
            timestamp: block.timestamp
        });

        emit VoteCast(challengeId, msg.sender, athlete, approved);
    }

    /**
     * @dev Resolve o desafio e distribui prêmios baseado no consenso
     */
    function resolveChallenge(uint256 challengeId) external {
        Challenge storage challenge = challenges[challengeId];
        require(challenge.isActive, "Challenge not active");
        require(
            block.timestamp > challenge.endTime + VALIDATION_DEADLINE,
            "Validation period not ended"
        );

        address[] memory winners = _calculateWinners(challengeId);
        challenge.isActive = false;

        if (winners.length > 0 && challenge.prizePool > 0) {
            uint256 prizePerWinner = challenge.prizePool / winners.length;
            
            for (uint256 i = 0; i < winners.length; i++) {
                require(
                    wodToken.transfer(winners[i], prizePerWinner),
                    "Prize transfer failed"
                );
            }

            challengeWinners[challengeId] = winners;
        }

        emit ChallengeResolved(challengeId, winners, challenge.prizePool);
    }

    /**
     * @dev Calcula vencedores baseado no consenso de validadores
     */
    function _calculateWinners(
        uint256 challengeId
    ) internal view returns (address[] memory) {
        Challenge storage challenge = challenges[challengeId];
        address[] memory tempWinners = new address[](challenge.participants.length);
        uint256 winnerCount = 0;

        uint256 totalValidators = validatorRegistry.getValidatorCount();

        for (uint256 i = 0; i < challenge.participants.length; i++) {
            address athlete = challenge.participants[i];
            if (!challenge.submissions[athlete].exists) continue;

            uint256 approvalCount = 0;
            uint256 voteCount = 0;

            // Contar votos para este atleta
            address[] memory validators = validatorRegistry.getValidators();
            for (uint256 j = 0; j < validators.length; j++) {
                bytes32 voteKey = keccak256(abi.encodePacked(challengeId, validators[j], athlete));
                Vote memory vote_ = votes[voteKey];
                if (vote_.timestamp > 0) {
                    voteCount++;
                    if (vote_.approved) {
                        approvalCount++;
                    }
                }
            }

            // Verificar consenso (51% dos validadores devem aprovar)
            if (
                voteCount > 0 &&
                (approvalCount * 100) / totalValidators >= MIN_CONSENSUS_PERCENT
            ) {
                tempWinners[winnerCount] = athlete;
                winnerCount++;
            }
        }

        // Criar array final com tamanho correto
        address[] memory finalWinners = new address[](winnerCount);
        for (uint256 i = 0; i < winnerCount; i++) {
            finalWinners[i] = tempWinners[i];
        }

        return finalWinners;
    }

    /**
     * @dev Verifica se um endereço entrou no desafio
     */
    function _hasEntered(
        Challenge storage challenge,
        address athlete
    ) private view returns (bool) {
        for (uint256 i = 0; i < challenge.participants.length; i++) {
            if (challenge.participants[i] == athlete) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Retorna informações do desafio (view)
     */
    function getChallenge(
        uint256 challengeId
    )
        external
        view
        returns (
            uint256 id,
            string memory name,
            string memory description,
            uint256 entryFee,
            uint256 prizePool,
            uint256 startTime,
            uint256 endTime,
            bool isActive,
            uint256 participantCount
        )
    {
        Challenge storage challenge = challenges[challengeId];
        return (
            challenge.id,
            challenge.name,
            challenge.description,
            challenge.entryFee,
            challenge.prizePool,
            challenge.startTime,
            challenge.endTime,
            challenge.isActive,
            challenge.participants.length
        );
    }

    /**
     * @dev Retorna submissão de um atleta
     */
    function getSubmission(
        uint256 challengeId,
        address athlete
    )
        external
        view
        returns (
            address athleteAddress,
            string memory proofCID,
            uint256 timestamp,
            bool exists
        )
    {
        Submission storage submission = challenges[challengeId].submissions[
            athlete
        ];
        return (
            submission.athlete,
            submission.proofCID,
            submission.timestamp,
            submission.exists
        );
    }
}

