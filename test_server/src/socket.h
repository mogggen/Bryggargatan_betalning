#ifndef SOCKET_H
#define SOCKET_H

/**This is my own light api layer for using sockets on multiple operating systems.
 * It's not perfect but works for my use cases.
 * Only some of the functions in winsock and berkley sockets are replaced by
 * my own functions, the rest are mostly the same.*/

#if WIN32

#include <ws2tcpip.h>
#include <sys/types.h>
#include <WinSock2.h>

#define error_no WSAGetLastError()
#define print_socket_error() fprintf(stderr, "%d\n", WSAGetLastError())
#define RECV_TIME_OUT_ERROR WSAETIMEDOUT

#define receive_from recvfrom
 
#else

#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <errno.h>
#include <string.h>

#define SOCKET int
#define SOCKET_ERROR -1

#define error_no errno
#define print_socket_error() fprintf(stderr, "%s\n", strerror(errno) )
#define RECV_TIME_OUT_ERROR EWOULDBLOCK

#define receive_from(socket, buff, len, flags, from, fromlen) recvfrom(socket, (void*)buff, flags, len, from, (unsigned int*)fromlen)

#endif

#if __cplusplus
extern "C" {
#else
#define true 1
#define false 0
#endif

/**Creates a socket. 
 * @return If the return value is equal to SOCKET_ERROR, it failed to create socket.
 * All the parameters are the same as the original socket().
 * */
SOCKET create_socket(int af, int type, int protocol);

/**Closes a socket.
 * @param socket socket to close.
 * */
void close_socket(SOCKET socket);

/**Checks if the socket has received data but don't read it.
 * @param socket socket to check.*/
char socket_has_received_data(SOCKET socket);

#if __cplusplus
}
#endif

#endif
