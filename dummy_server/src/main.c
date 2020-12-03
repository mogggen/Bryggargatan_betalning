#include <stdio.h>
#include "socket.h"
#include "linked_list.h"

#define BUF_SIZE 4096

struct CallbackWait
{
    int token;
    int lifetime;
};

char* get_http_data(char* msg)
{
    char prev = *msg;
    while(*msg != '\0')
    {
        if(*msg == prev && *msg == '\n')
            return msg+1;
        if(*msg != '\r') 
            prev = *msg;
        msg++;
    }
    return NULL;
}

void receive_http_request(SOCKET client_socket, int token)
{
    char buf[BUF_SIZE];

    while(1)
    {
        int read_bytes = recv(client_socket, buf, BUF_SIZE, 0);

        if(read_bytes == SOCKET_ERROR)
        {
            printf("<!> Failed to read.\n");
            print_socket_error();
            break;
        }
        if(read_bytes == 0)
            break;

        int i = BUF_SIZE > read_bytes ? read_bytes : BUF_SIZE-1;
        buf[i] = '\0';
        printf("%s\n", buf);

        char content[2048];
        char response_msg[2048];
        sprintf(content, "{\"AmILegitSwish\":\"Yes\", \"token\":\"%d\"}", token);
        sprintf(response_msg, "HTTP/1.1 200 OK\nServer: MeMyselfAndI\nAccess-Control-Allow-Origin: *\nContent-Type: text/plain;charset=UTF-8\nContent-Length: %llu\nConnection: close\n\n%s", strlen(content), content);
        int len = strlen(response_msg);
        send(client_socket, response_msg, len+1, 0);
    }
}

int send_callback_msg(int token)
{
    char content[2048];
    char callback_msg[2048];
    sprintf(content, "{\"Bambozzeled\":\"Yes, yes you are.\", \"token\":\"%d\", \"status\":\"PAID\"}\n", token);
    sprintf(callback_msg, "PUT / HTTP/1.1\nHost: localhost:9002\nContent-Length: %llu\n\n%s", strlen(content), content);

    printf("<> Sending callback\n");

    struct sockaddr_in callback_addr;
    callback_addr.sin_family = AF_INET;
    callback_addr.sin_port = htons(9002);
    inet_pton(AF_INET, "127.0.0.1", &callback_addr.sin_addr);
    SOCKET callback_socket = create_socket(AF_INET, SOCK_STREAM, 0);
    if (callback_socket == SOCKET_ERROR)
    {
        fprintf(stderr, "<!> Failed to create callback socket. ");
        print_socket_error();
        return false;
    }

    if (connect(callback_socket, (struct sockaddr*)&callback_addr, sizeof(callback_addr)) == SOCKET_ERROR)
    {
        fprintf(stderr, "<!> Failed to connect callback socket. ");
        print_socket_error();
        return false;
    }

    if (send(callback_socket, callback_msg, strlen(callback_msg), 0) == SOCKET_ERROR)
    {
        fprintf(stderr, "<!> Failed to send callback message. ");
        print_socket_error();
        return false;
    }
    
    shutdown(callback_socket, SD_BOTH);

    printf("<> Callback closed\n");
    return true;
}

int main(int argc, char** argv)
{
    SOCKET listening_socket = create_socket(AF_INET, SOCK_STREAM, 0);
    if (listening_socket == SOCKET_ERROR)
    {
        fprintf(stderr, "<!> Failed to create socket. ");
        print_socket_error();
        return false;
    }

    struct sockaddr_in server_addr;
    memset(&server_addr, 0, sizeof(server_addr));
    server_addr.sin_family = AF_INET;
    server_addr.sin_port = htons(9001);
    server_addr.sin_addr.s_addr = INADDR_ANY;

    if(bind(listening_socket, (struct sockaddr*)&server_addr, sizeof(server_addr)) == SOCKET_ERROR)
    {
        fprintf(stderr, "<!> Failed to bind socket. ");
        print_socket_error();
        return false;
    }

    if(listen(listening_socket, 10))
    {
        fprintf(stderr, "<!> Failed to listen on socket. ");
        print_socket_error();
        return false;
    }
    printf("<> Started to listen...\n");

    struct fd_set master_set, copy_set;
    FD_ZERO(&master_set);
    FD_SET(listening_socket, &master_set);
    
    struct timeval max_time = {0,100000}; // 100 ms

    struct LinkedList callback_jobs = {sizeof(struct CallbackWait), NULL}; 

    int token_id = 1;

    while(true)
    {
        copy_set = master_set;    

        int n_ready_sockets = select(0, &copy_set, NULL, NULL, &max_time);
        if(n_ready_sockets == SOCKET_ERROR)
        {
            printf("<!> Faild to select ");
            print_socket_error();
            return false;
        }

        // a new http request incoming
        if(FD_ISSET(listening_socket, &copy_set))
        {
            SOCKET client_socket = accept(listening_socket, NULL, NULL);
            if(client_socket == SOCKET_ERROR)
            {
                printf("<!> Failed to accept ");
                print_socket_error();
                continue;
            }

            printf("<> Client connected\n");

            receive_http_request(client_socket, token_id);

            shutdown(client_socket, SD_BOTH);
            printf("<> Client dissconnected\n");
            
            struct CallbackWait* new_callback = (struct CallbackWait*)add_element(&callback_jobs);
            new_callback->token = token_id;
            new_callback->lifetime = 100; // 1 lifetime = 100 ms
            token_id++;
        }

        // Are there any callback messages to send?
        struct LinkedListIterator it = create_iterator(&callback_jobs);
        while(next_iter(&it))
        {
            struct CallbackWait* c = (struct CallbackWait*)get_iter_value(&it);
            if(c->lifetime > 0)
                c->lifetime -= 1;
            else
            {
                send_callback_msg(c->token);
                remove_iter(&it);
            }
        }

    }

    close_socket(listening_socket);

    return 0;
}
