/**
 * @brief C-based Helloworld BPF program
 */
#include <solana_sdk.h>

uint64_t addData(SolParameters *params) {

  if (params->ka_num < 1) {
    sol_log("");
    return ERROR_NOT_ENOUGH_ACCOUNT_KEYS;
  }

  // Get the account to say hello to
  SolAccountInfo *main_account = &params->ka[0];

  // The account must be owned by the program in order to modify its data
  if (!SolPubkey_same(main_account->owner, params->program_id)) {
    sol_log("Account does not have the correct program id");
    return ERROR_INCORRECT_PROGRAM_ID;
  }

  // The data must be large enough to hold an uint32_t value
  if (main_account->data_len < sizeof(uint32_t)) {
    sol_log("Account data length too small to hold uint32_t value");
    return ERROR_INVALID_ACCOUNT_DATA;
  }

  // Increment and store the number of times the account has been greeted

  uint32_t my_data = (params->data[3]<<24) + (params->data[2]<<16) + (params->data[1]<<8) + params->data[0];
  uint32_t *datas = (uint32_t *)main_account->data;
  *datas = my_data;
  return SUCCESS;
}

extern uint64_t entrypoint(const uint8_t *input) {
  sol_log("Apollo Project C program");

  SolAccountInfo accounts[1];
  SolParameters params = (SolParameters){.ka = accounts};

  if (!sol_deserialize(input, &params, SOL_ARRAY_SIZE(accounts))) {
    return ERROR_INVALID_ARGUMENT;
  }

  return addData(&params);
}
