// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EventRegistry {
    address private owner;
    struct Event {
        string metadata;    // IPFS hash storing event details (name, price, location, times)
        address organizer;  // event organizer address
        uint256 maxRegistrations; // max registrations
        uint256 registeredCount;  // registered count
        bool isActive;      // event is active
        uint256 saleStartDate; // 销售开始时间戳
        uint256 saleEndDate;   // 销售结束时间戳
    }

    // store event information
    mapping(uint256 => Event) public events;
    // store each event's registered users
    mapping(uint256 => mapping(address => bool)) public registeredUsers;
    uint256 public eventCount;

    // event created event
    event EventCreated(
        uint256 indexed eventId,
        string metadata,
        address organizer
    );

    // user registered event
    event UserRegistered(
        uint256 indexed eventId,
        address indexed user
    );

    // create new event
    function createEvent(
        string memory _metadata,
        uint256 _maxRegistrations,
        uint256 _saleStartDate,
        uint256 _saleEndDate
    ) public {
        require(_maxRegistrations > 0, "Max registrations must be greater than 0");
        require(_saleEndDate > _saleStartDate, "End date must be after start date");
        eventCount++;
        events[eventCount] = Event({
            metadata: _metadata,
            organizer: msg.sender,
            maxRegistrations: _maxRegistrations,
            registeredCount: 0,
            isActive: true,
            saleStartDate: _saleStartDate,
            saleEndDate: _saleEndDate
        });

        emit EventCreated(
            eventCount,
            _metadata,
            msg.sender
        );
    }
    constructor() {
        owner = msg.sender;
    }

    // register for event
    function registerForEvent(uint256 _eventId, address _user) public {
        Event storage _event = events[_eventId];

        require(msg.sender == owner, "Only owner can register for event");
        require(_event.isActive, "Event does not exist or has ended");
        require(block.timestamp >= _event.saleStartDate, "Sale has not started yet");
        require(block.timestamp <= _event.saleEndDate, "Sale has ended");
        require(_event.registeredCount < _event.maxRegistrations, "Registration limit reached");
        require(!registeredUsers[_eventId][msg.sender], "You have already registered for this event");

        registeredUsers[_eventId][_user] = true;
        _event.registeredCount++;

        emit UserRegistered(_eventId, _user);
    }

    // check if user is registered
    function isRegistered(uint256 _eventId, address _user) public view returns (bool) {
        return registeredUsers[_eventId][_user];
    }

    // cancel user registration (only by event organizer or user himself)
    function cancelRegistration(uint256 _eventId, address _user) public {
        Event storage _event = events[_eventId];
        require(msg.sender == _user || msg.sender == _event.organizer, "No permission to perform this action");
        require(registeredUsers[_eventId][_user], "User has not registered for this event");

        registeredUsers[_eventId][_user] = false;
        _event.registeredCount--;
    }

    // view event details
    function getEvent(uint256 _eventId) public view returns (
        string memory metadata,
        address organizer,
        uint256 maxRegistrations,
        uint256 registeredCount,
        bool isActive,
        uint256 saleStartDate,
        uint256 saleEndDate
    ) {
        Event storage _event = events[_eventId];
        return (
            _event.metadata,
            _event.organizer,
            _event.maxRegistrations,
            _event.registeredCount,
            _event.isActive,
            _event.saleStartDate,
            _event.saleEndDate
        );
    }

    // get registered count
    function getRegisteredCount(uint256 _eventId) public view returns (uint256) {
        return events[_eventId].registeredCount;
    }
}
