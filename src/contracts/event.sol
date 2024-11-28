// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EventRegistry {
    struct Event {
        string name;        // 活動名稱
        uint256 price;      // 預期票價(僅供參考)
        uint256 timestamp;  // 活動時間
        string location;    // 活動地點
        address organizer;  // 活動主辦方地址
        uint256 maxRegistrations; // 最大註冊人數
        uint256 registeredCount;  // 已註冊人數
        bool isActive;      // 活動是否進行中
    }

    // 儲存活動信息
    mapping(uint256 => Event) public events;
    // 儲存每個活動的註冊用戶
    mapping(uint256 => mapping(address => bool)) public registeredUsers;
    uint256 public eventCount;

    // 活動創建事件
    event EventCreated(
        uint256 indexed eventId,
        string name,
        uint256 price,
        uint256 timestamp,
        string location,
        address organizer
    );

    // 用戶註冊事件
    event UserRegistered(
        uint256 indexed eventId,
        address indexed user
    );

    // 創建新活動
    function createEvent(
        string memory _name,
        uint256 _price,
        uint256 _timestamp,
        string memory _location,
        uint256 _maxRegistrations
    ) public {
        require(_timestamp > block.timestamp, "Event time must be in the future");
        require(_maxRegistrations > 0, "Max registrations must be greater than 0");

        eventCount++;
        events[eventCount] = Event({
            name: _name,
            price: _price,
            timestamp: _timestamp,
            location: _location,
            organizer: msg.sender,
            maxRegistrations: _maxRegistrations,
            registeredCount: 0,
            isActive: true
        });

        emit EventCreated(
            eventCount,
            _name,
            _price,
            _timestamp,
            _location,
            msg.sender
        );
    }

    // 註冊購買權
    function registerForEvent(uint256 _eventId) public {
        Event storage _event = events[_eventId];
        
        require(_event.isActive, "Event does not exist or has ended");
        require(_event.timestamp > block.timestamp, "Event has ended");
        require(_event.registeredCount < _event.maxRegistrations, "Registration limit reached");
        require(!registeredUsers[_eventId][msg.sender], "You have already registered for this event");

        registeredUsers[_eventId][msg.sender] = true;
        _event.registeredCount++;

        emit UserRegistered(_eventId, msg.sender);
    }

    // 檢查用戶是否已註冊
    function isRegistered(uint256 _eventId, address _user) public view returns (bool) {
        return registeredUsers[_eventId][_user];
    }

    // 取消用戶註冊（只能由活動主辦方或用戶本人操作）
    function cancelRegistration(uint256 _eventId, address _user) public {
        Event storage _event = events[_eventId];
        require(msg.sender == _user || msg.sender == _event.organizer, "No permission to perform this action");
        require(registeredUsers[_eventId][_user], "User has not registered for this event");

        registeredUsers[_eventId][_user] = false;
        _event.registeredCount--;
    }

    // 查看活動詳情
    function getEvent(uint256 _eventId) public view returns (
        string memory name,
        uint256 price,
        uint256 timestamp,
        string memory location,
        address organizer,
        uint256 maxRegistrations,
        uint256 registeredCount,
        bool isActive
    ) {
        Event storage _event = events[_eventId];
        return (
            _event.name,
            _event.price,
            _event.timestamp,
            _event.location,
            _event.organizer,
            _event.maxRegistrations,
            _event.registeredCount,
            _event.isActive
        );
    }

    // 獲取活動已註冊人數
    function getRegisteredCount(uint256 _eventId) public view returns (uint256) {
        return events[_eventId].registeredCount;
    }
}
