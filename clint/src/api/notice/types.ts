/**条件查询公告分页信息 */
export interface NoticeListQuery extends PageQuery {
  /**
   * 公告的标题
   */
  title?: string;
}

/**公告列表信息 */
export interface NoticeList {
  /**
   * 公告的内容
   */
  noticeContent?: string;
  /**
   * 发布时间
   */
  noticeCreateTime?: string;
  /**
   * 公告id
   */
  noticeId?: number;
  /**
   * 公告的标题
   */
  noticeTitle?: string;
  /**
   * 修改时间
   */
  noticeUpdateTime?: string;
  /**
   * 公告的发布人
   */
  userInfo?: string;
}

/**公告信息 */
export interface NoticeInfo {
  /**
   * 公告内容
   */
  noticeContent?: string;
  /**
   * 公告ID
   */
  noticeId?: number;
  /**
   * 公告标题
   */
  noticeTitle?: string;
}
