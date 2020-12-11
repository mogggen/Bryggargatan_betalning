cmake_minimum_required( VERSION 3.8 )

project( dummy_server )

set( CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_SOURCE_DIR}/bin )
set( CMAKE_EXPORT_COMPILE_COMMANDS ON )

file( GLOB SRC_FILES ${PROJECT_SOURCE_DIR}/src/*.c )
add_executable( dummy_server ${SRC_FILES} )
    
target_link_libraries( dummy_server )

target_include_directories( dummy_server PRIVATE ${CMAKE_SOURCE_DIR}/${COMMON_INCLUDE_DIR} )
set_property(DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR} PROPERTY VS_STARTUP_PROJECT dummy_server)