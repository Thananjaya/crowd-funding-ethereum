pragma solidity^0.4.17;

contract Factory{
    CrowdFunding[] public deployedContractAddresses;
    
    function createCrowdFunding(uint minimum) public {
        CrowdFunding newContract = new CrowdFunding(minimum, msg.sender);
        deployedContractAddresses.push(newContract);
    }
    
    function getDeployedContractAddresses() public view returns(CrowdFunding[] memory) {
        return deployedContractAddresses;
    }
}

contract CrowdFunding{
    struct spendingRequest {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint yesCount;
        mapping(address => bool) positiveVoters; // reference type so dont want to initialize while using this struct below
    }
    
    spendingRequest[] public requests;
    string crowdFundingTitle;
    string crowdFundingDescription;
    address public owner; // the one who looks for funding will be consider as an owner
    uint public minimumContribution; // owner saying that how much is the minimum contribution
    mapping(address => bool) public contributors; // contributors, peoples who contributes to the product. Stored in the form of mapping
    uint public totalContributorsCount;
    uint public contributionAmount;
    
    modifier managerAccess() {
        require(msg.sender == owner);
        _;
    }
    
    constructor(uint minimum, address creator) public {
        owner = creator;
        minimumContribution = minimum;
    }
    
    function contribute() public payable {
        require(msg.value >= minimumContribution);
        contributionAmount += msg.value;
        contributors[msg.sender] = true;
        totalContributorsCount++;
    }
    
    function raisingSpendingRequest( string memory description, uint value, address recipient) public managerAccess {
        require(value < contributionAmount);
        spendingRequest memory newRequest = spendingRequest({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            yesCount: 0
        });
        
        requests.push(newRequest);
    }
    
    function approvingRequest(uint spendingRequestIndex) public {
        spendingRequest storage request = requests[spendingRequestIndex];
        
        require(contributors[msg.sender]);
        require(!request.positiveVoters[msg.sender]);
        
        request.positiveVoters[msg.sender] = true;
        request.yesCount ++;
    }
    
    function finalizeRequest(uint spendingRequestIndex) public managerAccess{
        spendingRequest storage request = requests[spendingRequestIndex];
        
        require(request.yesCount > (totalContributorsCount/2));
        require(!request.complete);
        
        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (uint, uint, uint, uint, address) {
        return(
            minimumContribution,
            this.balance,
            requests.length,
            totalContributorsCount,
            owner  
        );
    }

    function getSpendingRequestCount() public view returns (uint) {
        return requests.length;
    }
    
}