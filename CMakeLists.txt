project ("Telematry")
cmake_minimum_required (VERSION 3.8)

SET(Boost_USE_STATIC_LIBS OFF)
SET(Boost_USE_MULTITHREAD OFF)

find_package(Boost COMPONENTS system thread chrono REQUIRED)

INCLUDE_DIRECTORIES(${Boost_INCLUDE_DIRS})
LINK_DIRECTORIES(${Boost_LIBRARY_DIRS})

include_directories(
    "lib"
    "data_types"
    "UDPServer/src"
    "telematry/src"
    "websocket/src"
)

add_executable ( telematry 
    "UDPServer/src/UDPServer.cpp" 
    "UDPServer/src/UDPServer.h"
    "UDPServer/src/UDPThread.cpp"
    "UDPServer/src/UDPThread.h"
    "UDPServer/src/UDPBroadcaster.h"
    "UDPServer/src/UDPBroadcaster.cpp"
    "UDPServer/src/TCPSubscriber.h"

    "telematry/src/telematry.cpp" 
    "telematry/src/telematry.h"
    "telematry/src/main.cpp"

    "websocket/src/Websocket.cpp"
    "websocket/src/Websocket.h"
)

target_link_libraries(telematry ${Boost_LIBRARIES} pthread)
