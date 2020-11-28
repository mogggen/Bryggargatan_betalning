#include "linked_list.h"

#include <stdlib.h>

void* add_element(struct LinkedList* list)
{
    struct __Element* new = (struct __Element*)malloc(sizeof(struct __Element) + list->element_size);

    new->next = list->head;
    list->head = new;
    
    return (void*)&new->data;
}

void free_all_elements(struct LinkedList* list)
{
    struct __Element* tmp, *current = list->head;
    while(current != NULL)
    {
        tmp = current;
        current = current->next;
        free(tmp);
    }

    list->head = NULL;
}

struct LinkedListIterator create_iterator(struct LinkedList* list)
{
    struct LinkedListIterator ret = {list, NULL, NULL };
    return ret;
}

char next_iter(struct LinkedListIterator* iter)
{
    if(iter->current == NULL)
    {
        iter->current = iter->list->head;
    }
    else
    {
        iter->prev = iter->current;
        iter->current = iter->current->next;
    }

    if(iter->current != NULL)
        return 1;
    else
        return 0;
}

void* get_iter_value(struct LinkedListIterator* iter)
{
    return (void*)&iter->current->data;
}

void remove_iter(struct LinkedListIterator* iter)
{
    if(iter->current == iter->list->head)
    {
        iter->list->head = iter->current->next;
        free(iter->current);
        iter->current = NULL;
    }
    else
    {
        iter->prev->next = iter->current->next;
        free(iter->current);
        iter->current = iter->prev;
    }
}
